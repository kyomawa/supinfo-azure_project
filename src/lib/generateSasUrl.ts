"use server";

import "server-only";

import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

// =============================================================================================================================================

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(
    `Veuillez définir AZURE_STORAGE_CONNECTION_STRING ${AZURE_STORAGE_CONNECTION_STRING} dans votre fichier .env, l'erreur provient de la fonction generateSASURL`
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// =============================================================================================================================================

/**
 * Génère une URL SAS pour un blob spécifique.
 * @param blobUrl - L'URL complète du blob.
 * @returns L'URL du blob avec le token SAS.
 */

export async function generateSASURL(blobUrl: string): Promise<string> {
  const url = new URL(blobUrl);
  const containerName = url.pathname.split("/")[1];
  const blobName = url.pathname.split("/").slice(2).join("/");

  const sasOptions = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"),
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 24 * 3600 * 1000),
    protocol: SASProtocol.Https,
    version: "2024-11-04",
  };
  const credential = blobServiceClient.credential as StorageSharedKeyCredential;

  const sasToken = generateBlobSASQueryParameters(sasOptions, credential).toString();
  return `${blobUrl}?${sasToken}`;
}

// =============================================================================================================================================
