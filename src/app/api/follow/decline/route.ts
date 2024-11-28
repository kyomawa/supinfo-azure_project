import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// ==================================================================================================

export async function DELETE(request: NextRequest) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const followerId = url.searchParams.get("followerId");
  const followingId = url.searchParams.get("followingId");
  const notificationId = url.searchParams.get("notificationId");

  const followDeleted = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: followerId!,
        followingId: followingId!,
      },
    },
  });

  if (!followDeleted) {
    return NextResponse.json(
      {
        success: false,
        message: "Suivi introuvable.",
      },
      { status: 404 }
    );
  }

  await prisma.notification.delete({
    where: { id: notificationId! },
  });

  revalidateTag("follows");

  return NextResponse.json({
    success: true,
    message: "Demande de suivi refusée.",
    data: followDeleted,
  });
}

// ==================================================================================================
