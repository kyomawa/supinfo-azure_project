import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Notification } from "@prisma/client";
import { auth } from "@/lib/auth";

// =================================================================================================================

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Authentification requise.",
          data: null,
        },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse<Notification[]>>({
      success: true,
      message: "Notifications récupérées avec succès.",
      data: notifications,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des notifications.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
