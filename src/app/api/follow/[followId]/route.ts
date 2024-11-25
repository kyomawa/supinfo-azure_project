import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";

// ==================================================================================================

export async function DELETE(request: NextRequest, { params }: { params: { followId: string } }) {
  const { followId } = params;

  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  let followDeleted;

  if (type === "follower") {
    const followToDelete = await prisma.follow.findFirst({
      where: { followerId: followId },
    });

    if (!followToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun abonnement correspondant trouvé.",
        },
        { status: 404 }
      );
    }

    followDeleted = await prisma.follow.delete({
      where: { id: followToDelete.id },
    });
  } else if (type === "following") {
    const followToDelete = await prisma.follow.findFirst({
      where: { followingId: followId },
    });

    if (!followToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun abonnement correspondant trouvé.",
        },
        { status: 404 }
      );
    }

    followDeleted = await prisma.follow.delete({
      where: { id: followToDelete.id },
    });
  } else {
    followDeleted = await prisma.follow.delete({
      where: { id: followId },
    });
  }

  if (!followDeleted) {
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la suppression de l'abonnement.",
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

  return NextResponse.json({
    success: true,
    message: "Abonnement supprimé avec succès.",
    data: followDeleted,
  });
}

// ==================================================================================================
