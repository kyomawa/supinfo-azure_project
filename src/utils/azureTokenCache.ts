"use server";

import "server-only";

// =============================================================================================================================================

interface AzureToken {
  accessToken: string;
  fetchedAt: number;
}

const TENANT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!;
const CLIENT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_ID!;
const CLIENT_SECRET = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!;
const SCOPE = process.env.AUTH_MICROSOFT_ENTRA_ID_SCOPE!;

// =============================================================================================================================================

let cachedToken: AzureToken | null = null;

// =============================================================================================================================================

/**
 * Fonction pour obtenir un nouveau token Azure AD via le flux client credentials.
 */
async function fetchNewAzureToken(): Promise<AzureToken> {
  const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("scope", SCOPE);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "client_credentials");

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Échec de la récupération du token Azure : ${errorData.error_description || response.statusText}`);
  }

  const data = await response.json();

  const fetchedAt = Date.now();

  return {
    accessToken: data.access_token,
    fetchedAt,
  };
}

// =============================================================================================================================================

/**
 * Fonction pour obtenir le token Azure, avec mise en cache.
 * Le token est renouvelé toutes les 50 minutes.
 */
export async function getAzureToken(): Promise<string> {
  const now = Date.now();
  const cacheDuration = 50 * 60 * 1000;

  if (cachedToken && now - cachedToken.fetchedAt < cacheDuration) {
    return cachedToken.accessToken;
  }

  cachedToken = await fetchNewAzureToken();

  return cachedToken.accessToken;
}

// =============================================================================================================================================
