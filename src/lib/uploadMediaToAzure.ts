"use server";

import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";

// =============================================================================================================================================

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(
    `Veuillez définir AZURE_STORAGE_CONNECTION_STRING ${AZURE_STORAGE_CONNECTION_STRING} dans votre fichier .env, l'erreur provient de la fonction uploadMediaToAzure`
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

  const extension = path.extname(file.name) || "";
  const uniqueFileName = `${crypto.randomUUID()}${extension}`;

  const blobName = `${folderPath}/${uniqueFileName}`;

  let fileBuffer: Buffer;

  try {
    const arrayBuffer = await file.arrayBuffer();
    fileBuffer = Buffer.from(arrayBuffer);

    if (containerName === "images") {
      fileBuffer = await sharp(fileBuffer).resize(1200, 1200, { fit: "inside" }).jpeg({ quality: 80 }).toBuffer();
    }

    // Pour les vidéos, vous pouvez ajouter une compression ici si nécessaire
    // Exemple avec ffmpeg (optionnel)
    // if (containerName === "videos") {
    //   // Implémenter la compression vidéo avec ffmpeg
    // }
  } catch (error) {
    console.error("Erreur lors de la lecture ou de la compression du fichier :", error);
    throw new Error("Erreur lors de la lecture ou de la compression du fichier.");
  }

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists();

    const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: mediaType },
    });

    const blobUrl = blockBlobClient.url;

    return blobUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload vers Azure Blob :", error);
    throw new Error("Erreur lors du téléchargement du fichier.");
  }
}
