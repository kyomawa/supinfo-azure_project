import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { generateSASURL } from "@/lib/generateSasUrl";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: params.userId },
      select: {
        id: true,
        actor: true,
        content: true,
        createdAt: true,
        isRead: true,
      },
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

    notifications.map((notification) => {
      notification.actor.image = notification.actor.image
        ? generateSASURL(notification.actor.image)
        : notification.actor.image;
    });

    return NextResponse.json<ApiResponse<NotificationByUserIdEndpointProps[]>>({
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
