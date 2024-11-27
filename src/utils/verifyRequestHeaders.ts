"use server";

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { auth } from "@/lib/auth";

// =============================================================================================================================================

const API_CLIENT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_ID!;
const TENANT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!;

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

export async function verifyRequestHeaders(request: NextRequest, needApikeyverif = true): Promise<NextResponse | null> {
  if (needApikeyverif) {
    const apiKey = request.headers.get("x-sap-secret-api-key");
    const validApiKeys = process.env.SAP_SECRET_API_KEY?.split(",") || [];

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "La clé API est manquante.", data: null }, { status: 401 });
    }

    if (!validApiKeys.includes(apiKey)) {
      return NextResponse.json({ success: false, message: "Clé API invalide.", data: null }, { status: 403 });
    }
  }

  const isConnected = await auth();

  if (isConnected) {
    return null;
  }

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
