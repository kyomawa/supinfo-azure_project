import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

// =============================================================================================================================================

const TENANT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!;
const API_CLIENT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_ID!;

const JWKS = createRemoteJWKSet(new URL(`https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`));

// =============================================================================================================================================

async function validateAzureADToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWKS, {
      issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
      audience: API_CLIENT_ID,
    });

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

// =============================================================================================================================================

export async function verifyAzureToken(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get("Authorization") || request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const accessToken = authHeader.substring(7);

    const isValidToken = await validateAzureADToken(accessToken);
    if (isValidToken) {
      return null;
    } else {
      return NextResponse.json({ success: false, message: "Token d'accès invalide.", data: null }, { status: 401 });
    }
  }

  return NextResponse.json({ success: false, message: "Non autorisé.", data: null }, { status: 401 });
}

// =============================================================================================================================================
