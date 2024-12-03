// utils/verifyHost.ts

import { NextRequest, NextResponse } from "next/server";

// =============================================================================================================================================

/**
 * Vérifie si l'hôte de la requête est autorisé.
 * @param request - L'objet NextRequest.
 * @returns Un NextResponse avec un message d'erreur si l'hôte n'est pas autorisé, sinon null.
 */
export function verifyHost(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === "development") return null;

  const host = request.headers.get("host");

  if (!host) {
    return NextResponse.json(
      { success: false, message: "Hôte manquant ou non autorisé.", data: null },
      { status: 400 }
    );
  }

  const allowedHosts = ["api.supinfo-azure-project.fr", "supinfo-azure-project.fr", "editor.swagger.io"];

  const isAllowed = allowedHosts.some((allowedHost) => {
    return host.toLowerCase() === allowedHost.toLowerCase();
  });

  if (!isAllowed) {
    return NextResponse.json({ success: false, message: "L'hôte n'est pas autorisé.", data: null }, { status: 401 });
  }

  return null;
}

// =============================================================================================================================================
