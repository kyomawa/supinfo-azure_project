import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";

// =============================================================================

export async function POST(request: NextRequest) {
  const verif = verifyRequestHeaders(request);
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

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (existingFollow) {
    return NextResponse.json(
      {
        success: false,
        message: "Vous suivez déjà cet utilisateur.",
      },
      { status: 400 }
    );
  }

  const follow = await prisma.follow.create({
    data: { followerId, followingId },
  });

  if (!follow) {
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la création du lien de suivi.",
    });
  }

  await prisma.notification.create({
    data: {
      content: "vous suit",
      userId: followingId,
      actorId: followerId,
      type: "FOLLOW",
      triggerId: follow.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Utilisateur suivi avec succès.",
    data: follow,
  });
}

// =============================================================================
