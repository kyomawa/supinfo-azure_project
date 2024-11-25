import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { revalidateTag } from "next/cache";

// ==================================================================================================

export async function DELETE(request: NextRequest) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const followerId = url.searchParams.get("followerId");
  const followingId = url.searchParams.get("followingId");

  if (!followerId || !followingId) {
    return NextResponse.json(
      {
        success: false,
        message: "followerId et followingId sont requis.",
      },
      { status: 400 }
    );
  }

  const followDeleted = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (!followDeleted) {
    return NextResponse.json(
      {
        success: false,
        message: "Aucun abonnement ou demande de suivi correspondant trouvé.",
      },
      { status: 404 }
    );
  }

  await prisma.notification.deleteMany({
    where: {
      type: "FOLLOW",
      triggerId: followDeleted.id,
    },
  });

  revalidateTag("follows");

  return NextResponse.json({
    success: true,
    message: "La suppression a bien été effectuée.",
    data: followDeleted,
  });
}

// ==================================================================================================
