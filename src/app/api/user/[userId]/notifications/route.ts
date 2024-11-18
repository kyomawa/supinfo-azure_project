import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Notification } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: params.userId },
    });

    if (!notifications) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Notifications non trouvées.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Notification[]>>({
      success: true,
      message: "Liste des notifications récupérées avec succès.",
      data: notifications,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications de l'utilisateur:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des notifications de l'utilisateur.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
