import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// ==========================================================================

export async function PATCH(request: NextRequest) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const { followerId, followingId } = await request.json();

  if (!followerId || !followingId) {
    return NextResponse.json(
      {
        success: false,
        message: "Les identifiants followerId et followingId sont requis.",
      },
      { status: 400 }
    );
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (!follow) {
    return NextResponse.json(
      {
        success: false,
        message: "Relation de suivi introuvable.",
      },
      { status: 404 }
    );
  }

  const updatedFollow = await prisma.follow.update({
    where: {
      followerId_followingId: { followerId, followingId },
    },
    data: {
      notifyOnNewPost: !follow.notifyOnNewPost,
    },
  });

  return NextResponse.json({
    success: true,
    message: `Notifications ${updatedFollow.notifyOnNewPost ? "activées" : "désactivées"} avec succès.`,
    data: updatedFollow,
  });
}

// ===========================================================================
