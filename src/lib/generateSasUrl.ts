import "server-only";

import {
  BlobSASPermissions,
  BlobSASSignatureValues,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import blobServiceClient from "./azureBlob";

// =============================================================================================================================================

/**
 * Génère une URL SAS pour un blob spécifique.
 * @param blobUrl - L'URL complète du blob.
 * @returns L'URL du blob avec le token SAS.
 */

export function generateSASURL(blobUrl: string): string {
  const url = new URL(blobUrl);
  const containerName = url.pathname.split("/")[1];
  const blobName = url.pathname.split("/").slice(2).join("/");

  const sasOptions: BlobSASSignatureValues = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"),
    startsOn: new Date(new Date().valueOf() - 5 * 60 * 1000),
    expiresOn: new Date(new Date().valueOf() + 1 * 3600 * 1000),
    protocol: SASProtocol.Https,
    version: "2025-01-05",
  };
  const credential = blobServiceClient.credential as StorageSharedKeyCredential;

  const sasToken = generateBlobSASQueryParameters(sasOptions, credential).toString();
  return `${blobUrl}?${sasToken}`;
}

// =============================================================================================================================================
