"use server";

import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(`Veuillez définir AZURE_STORAGE_CONNECTION_STRING dans votre fichier .env.`);
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

/**
 * Supprime un fichier média d'Azure Blob Storage en fonction de son URL.
 * Si le média est une vidéo, sa miniature correspondante est également supprimée.
 * @param mediaUrl L'URL publique du média à supprimer.
 */
export async function deleteMediaFromAzure(mediaUrl: string): Promise<void> {
  try {
    const blobUrlParts = new URL(mediaUrl);
    const containerName = blobUrlParts.pathname.split("/")[1]; // Extrait le nom du conteneur
    const blobName = blobUrlParts.pathname.substring(containerName.length + 2); // Extrait le chemin du blob

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Supprime le blob principal (vidéo ou image)
    const response = await blockBlobClient.deleteIfExists();
    if (response.succeeded) {
      console.log(`Média supprimé : ${mediaUrl}`);
    } else {
      console.warn(`Le média n'a pas pu être supprimé ou n'existe pas : ${mediaUrl}`);
    }

    // Si c'est une vidéo, tenter de supprimer la miniature correspondante
    if (containerName === "videos") {
      const thumbnailBlobName = blobName.replace(".webm", ".jpg"); // Remplace l'extension de la vidéo par celle de la miniature
      const thumbnailsContainerClient = blobServiceClient.getContainerClient("thumbnails");
      const thumbnailBlobClient = thumbnailsContainerClient.getBlockBlobClient(thumbnailBlobName);

      const thumbnailResponse = await thumbnailBlobClient.deleteIfExists();
      if (thumbnailResponse.succeeded) {
        console.log(`Miniature supprimée : ${thumbnailBlobName}`);
      } else {
        console.warn(`La miniature n'a pas pu être supprimée ou n'existe pas : ${thumbnailBlobName}`);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du média : ${mediaUrl}`, error);
    throw new Error("Erreur lors de la suppression du média.");
  }
}
