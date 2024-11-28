import { NextRequest, NextResponse } from "next/server";

// =============================================================================================================================================

const SAP_SECRET_API_KEY = process.env.SAP_SECRET_API_KEY!;

// =============================================================================================================================================

export function verifySecretKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get("x-sap-secret-api-key");
  const validApiKeys = SAP_SECRET_API_KEY.split(",").map((key) => key.trim());

  if (!apiKey) {
    return NextResponse.json({ success: false, message: "Clé API manquante.", data: null }, { status: 401 });
  }

  if (!validApiKeys.includes(apiKey)) {
    return NextResponse.json({ success: false, message: "Clé API invalide.", data: null }, { status: 401 });
  }

  return null;
}

// =============================================================================================================================================
