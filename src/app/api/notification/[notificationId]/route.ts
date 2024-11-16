import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Notification } from "@prisma/client";
import { auth } from "@/lib/auth";

// =================================================================================================================

export async function GET({ params }: { params: { notificationId: string } }) {
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

    const notification = await prisma.notification.findUnique({
      where: { id: params.notificationId },
    });

    if (!notification || notification.userId !== session.user.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Notification non trouvée.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Notification>>({
      success: true,
      message: "Notification récupérée avec succès.",
      data: notification,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la notification :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération de la notification.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
