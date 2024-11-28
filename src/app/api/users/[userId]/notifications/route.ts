import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateSASURL } from "@/lib/generateSasUrl";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam) : 0;
  const take = takeParam ? parseInt(takeParam) : undefined;

  const notifications = await prisma.notification.findMany({
    where: { userId: params.userId },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    select: {
      id: true,
      actor: true,
      type: true,
      content: true,
      createdAt: true,
      isRead: true,
    },
  });

  if (!notifications || notifications.length === 0) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Aucune notification trouvée.",
        data: null,
      },
      { status: 404 }
    );
  }

  const notificationsWithImages = notifications.map((notification) => {
    notification.actor.image = notification.actor.image
      ? generateSASURL(notification.actor.image)
      : notification.actor.image;
    return notification;
  });

  return NextResponse.json<ApiResponse<NotificationByUserIdEndpointProps[]>>({
    success: true,
    message: "Liste des notifications récupérées avec succès.",
    data: notificationsWithImages,
  });
}

// =================================================================================================================
