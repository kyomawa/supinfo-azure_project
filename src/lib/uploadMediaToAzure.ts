"use server";

import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import sharp from "sharp";
import crypto from "crypto";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import os from "os";
import path from "path";

if (process.env.NODE_ENV === "development") {
  const ffmpegPathDev = process.env.FFMPEG_PATH;
  if (!ffmpegPathDev) {
    throw new Error(
      "Installer ffmpeg pour pouvoir compresser et convertir une video. Lien : https://ffmpeg.org/download.html, placez le dossier ffmpeg sur votre PC et définissez la variable env FFMPEG_PATH dans votre fichier .env à la racine de ce projet, exemple : FFMPEG_PATH='C:\ffmpeg\bin\ffmpeg.exe' "
    );
  }
} else {
  ffmpeg.setFfmpegPath("/home/ffmpeg");
  ffmpeg.setFfprobePath("/home/ffprobe");
}

// =============================================================================================================================================

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(
    `Veuillez définir AZURE_STORAGE_CONNECTION_STRING dans votre fichier .env, l'erreur provient de la fonction uploadMediaToAzure`
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// =============================================================================================================================================

/**
 * Télécharge un média (image ou vidéo) sur Azure Blob Storage après compression si nécessaire.
 * @param file Le fichier à uploader.
 * @param folderPath Le chemin/folder où uploader le fichier, par exemple 'posts/{creatorId}'.
 * @returns L'URL publique du fichier uploadé.
 */
export async function uploadMediaToAzure(file: File, folderPath: string): Promise<string> {
  const mediaType = file.type;
  let containerName: "images" | "videos";

  if (mediaType.startsWith("image/")) {
    containerName = "images";
  } else if (mediaType.startsWith("video/")) {
    containerName = "videos";
  } else {
    throw new Error("Type de fichier non supporté.");
  }

  if (containerName === "images") {
    return await uploadImageToAzure(file, folderPath);
  }

  if (containerName === "videos") {
    return await uploadVideoToAzure(file, folderPath);
  }

  throw new Error("Type de média non pris en charge.");
}

// =============================================================================================================================================

/**
 * Gère l'upload d'une image sur Azure Blob Storage après compression.
 * @param file Le fichier image à uploader.
 * @param folderPath Le chemin/folder où uploader le fichier, par exemple 'posts/{creatorId}'.
 * @returns L'URL publique de l'image uploadée.
 */
async function uploadImageToAzure(file: File, folderPath: string): Promise<string> {
  const uniqueFileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
  const blobName = `${folderPath}/${uniqueFileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = await sharp(Buffer.from(arrayBuffer))
    .resize(1200, 1200, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toBuffer();

  const containerClient = blobServiceClient.getContainerClient("images");
  await containerClient.createIfNotExists();

  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return blockBlobClient.url;
}

// =============================================================================================================================================

/**
 * Gère l'upload d'une vidéo sur Azure Blob Storage après compression et conversion en WebM.
 * Génère également une miniature (thumbnail) de haute qualité (1080p maximum) à partir de la première frame de la vidéo.
 * Les vidéos et les miniatures partagent le même nom de fichier.
 * @param file Le fichier vidéo à uploader.
 * @param folderPath Le chemin/folder où uploader le fichier, par exemple 'posts/{creatorId}'.
 * @returns L'URL publique de la vidéo uploadée.
 */
async function uploadVideoToAzure(file: File, folderPath: string): Promise<string> {
  const uniqueFileName = `${crypto.randomUUID()}`; // Nom unique sans extension
  const videoBlobName = `${folderPath}/${uniqueFileName}.webm`;
  const thumbnailBlobName = `${folderPath}/${uniqueFileName}.jpg`; // Miniature avec la même base de nom

  const tempFilePath = path.join(os.tmpdir(), `${crypto.randomUUID()}-input.mp4`);
  const tempOutputPath = path.join(os.tmpdir(), `${crypto.randomUUID()}-output.webm`);
  const tempThumbnailPath = path.join(os.tmpdir(), `${crypto.randomUUID()}-thumbnail.jpg`);

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // Écrire le fichier temporaire
  await fs.promises.writeFile(tempFilePath, inputBuffer);

  const containerClient = blobServiceClient.getContainerClient("videos");
  const thumbnailsContainerClient = blobServiceClient.getContainerClient("thumbnails");

  await containerClient.createIfNotExists();
  await thumbnailsContainerClient.createIfNotExists();

  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(videoBlobName);
  const thumbnailBlobClient: BlockBlobClient = thumbnailsContainerClient.getBlockBlobClient(thumbnailBlobName);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(tempFilePath)
      .outputOptions([
        "-vf scale=-2:1080", // Limiter la résolution maximale à 1080p
        "-preset medium", // Utiliser un préréglage rapide
        "-c:v libvpx", // Codec VP8 pour WebM
        "-crf 25", // Réduire la qualité pour accélérer
        "-b:v 1M", // Bitrate vidéo fixe à 1 Mbps
        "-maxrate 2.5M", // Définir un bitrate max à 2.5 Mbps
        "-bufsize 5M", // Définir une taille de buffer pour des encodages plus stables
        "-c:a libvorbis", // Codec audio Vorbis
        "-q:a 4", // Améliorer la qualité audio (0-10, 4 est une bonne qualité)
      ])
      .format("webm") // Format de sortie WebM
      .output(tempOutputPath) // Fichier temporaire de sortie
      .on("end", async () => {
        try {
          // Lire le fichier temporaire converti et l'uploader sur Azure
          const convertedBuffer = await fs.promises.readFile(tempOutputPath);
          await blockBlobClient.uploadData(convertedBuffer, {
            blobHTTPHeaders: { blobContentType: "video/webm" },
          });

          // Génération de la miniature haute qualité à partir de la vidéo
          await new Promise<void>((thumbnailResolve, thumbnailReject) => {
            ffmpeg(tempFilePath)
              .outputOptions([
                "-vf scale=-2:1080", // Miniature en 1080p maximum, conserve le ratio
                "-q:v 2", // Qualité JPEG optimale (2 = haute qualité)
              ])
              .frames(1) // Extraire une seule frame
              .output(tempThumbnailPath) // Emplacement de la miniature temporaire
              .on("end", async () => {
                try {
                  // Lire la miniature et l'uploader sur Azure
                  const thumbnailBuffer = await fs.promises.readFile(tempThumbnailPath);
                  await thumbnailBlobClient.uploadData(thumbnailBuffer, {
                    blobHTTPHeaders: { blobContentType: "image/jpeg" },
                  });

                  // Supprimer la miniature temporaire
                  await fs.promises.unlink(tempThumbnailPath);
                  thumbnailResolve();
                } catch (err) {
                  thumbnailReject(err);
                }
              })
              .on("error", (err) => thumbnailReject(err))
              .run();
          });

          // Nettoyage des fichiers temporaires
          await fs.promises.unlink(tempFilePath);
          await fs.promises.unlink(tempOutputPath);

          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", async (err) => {
        console.error("Erreur lors de la conversion vidéo :", err);

        // Nettoyage en cas d'échec
        await fs.promises.unlink(tempFilePath).catch(() => {});
        await fs.promises.unlink(tempOutputPath).catch(() => {});
        reject(new Error("Erreur lors de la conversion vidéo."));
      })
      .run();
  });

  return blockBlobClient.url;
}

// =============================================================================================================================================
