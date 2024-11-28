import { NextRequest, NextResponse } from "next/server";
import { generateSASURL } from "@/lib/generateSasUrl";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// ========================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { url: string } }) {
  const verif = await verifyRequestHeaders(request, false);
  if (verif) return verif;

  const { url } = params;

  if (!url) {
    return NextResponse.json({ success: false, message: "URL manquante", data: null }, { status: 400 });
  }

  const sasUrl = generateSASURL(url);

  const response = await fetch(sasUrl);

  if (!response.ok) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération du média", data: null },
      { status: 400 }
    );
  }

  const contentType = response.headers.get("Content-Type") || "application/octet-stream";

  return NextResponse.json(response.body, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=45, must-revalidate",
    },
  });
}

// ========================================================================================================================
