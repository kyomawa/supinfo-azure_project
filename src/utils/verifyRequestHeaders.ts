import { NextRequest, NextResponse } from "next/server";
import { verifySecretKey } from "./verifySecretKey";
import { verifyAzureToken } from "./verifyAzureToken";
import { verifyHost } from "./verifyHost";

// =============================================================================================================================================

export default async function verifyRequestHeaders(
  request: NextRequest,
  needApiKeyVerif: boolean = true
): Promise<NextResponse | null> {
  if (needApiKeyVerif) {
    const apiKeyVerif = verifySecretKey(request);
    if (apiKeyVerif) return apiKeyVerif;
  }

  const azureTokenVerif = await verifyAzureToken(request);
  if (azureTokenVerif) return azureTokenVerif;

  const hostVerif = verifyHost(request);
  if (hostVerif) return hostVerif;

  return null;
}

// =============================================================================================================================================
