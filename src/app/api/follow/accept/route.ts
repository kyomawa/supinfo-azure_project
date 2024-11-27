import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { revalidateTag } from "next/cache";

// ==================================================================================================

export async function POST(request: NextRequest) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const { followerId, followingId, notificationId } = await request.json();

  const follow = await prisma.follow.update({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
    data: {
      status: "CONFIRMED",
    },
  });

  if (!follow) {
    return NextResponse.json(
      {
        success: false,
        message: "Suivi introuvable.",
      },
      { status: 404 }
    );
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: {
      content: "vous suit",
    },
  });

  revalidateTag("follows");

  return NextResponse.json({
    success: true,
    message: "Demande de suivi acceptée.",
    data: follow,
  });
}

// ==================================================================================================
