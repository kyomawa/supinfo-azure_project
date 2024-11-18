import { NextRequest, NextResponse } from "next/server";

export function verifyRequestHeaders(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get("x-sap-secret-api-key");
  const validApiKeys = process.env.SAP_SECRET_API_KEY?.split(",") || [];

  if (!apiKey) {
    return NextResponse.json({ success: false, message: "La clé API est manquante.", data: null }, { status: 401 });
  }

  if (!validApiKeys.includes(apiKey)) {
    return NextResponse.json({ success: false, message: "Clé API invalide.", data: null }, { status: 403 });
  }

  return null;
}
