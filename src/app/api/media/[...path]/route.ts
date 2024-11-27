import { NextRequest, NextResponse } from "next/server";
import { generateSASURL } from "@/lib/generateSasUrl";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";

// ========================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const verif = await verifyRequestHeaders(request, false);
  if (verif) return verif;

  const { path } = params;

  if (!path || !Array.isArray(path)) {
    return NextResponse.json({ success: false, message: "Chemin invalide", data: null }, { status: 400 });
  }

  const blobUrl = `${process.env.AZURE_ACCOUNT_STORAGE_BLOB}${path.join("/")}`;

  const sasUrl = generateSASURL(blobUrl);

  const response = await fetch(sasUrl);

  if (!response.ok) {
    return new NextResponse("Erreur lors de la récupération du média", { status: response.status });
  }

  const contentType = response.headers.get("Content-Type") || "application/octet-stream";
  const res = new NextResponse(response.body, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=45, must-revalidate",
    },
  });

  return res;
}

// ========================================================================================================================
