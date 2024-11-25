import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { revalidateTag } from "next/cache";

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

  const followingUser = await prisma.user.findUnique({
    where: { id: followingId },
    select: { visibility: true },
  });

  if (!followingUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Utilisateur à suivre non trouvé.",
      },
      { status: 404 }
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

  const status = followingUser.visibility === "PRIVATE" ? "PENDING" : "CONFIRMED";

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
      status,
    },
  });

  if (!follow) {
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la création du lien de suivi.",
    });
  }

  if (status === "CONFIRMED") {
    await prisma.notification.create({
      data: {
        content: "vous suit",
        userId: followingId,
        actorId: followerId,
        type: "FOLLOW",
        triggerId: follow.id,
      },
    });
  }

  if (status === "PENDING") {
    await prisma.notification.create({
      data: {
        content: "vous a envoyé une demande de suivi",
        userId: followingId,
        actorId: followerId,
        type: "FOLLOW",
        triggerId: follow.id,
      },
    });
  }

  revalidateTag("follows");

  return NextResponse.json({
    success: true,
    message: status === "CONFIRMED" ? "Utilisateur suivi avec succès." : "Demande de suivi envoyée.",
    data: follow,
  });
}

// =============================================================================

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
        message: "Les identifiants followerId et followingId sont requis.",
      },
      { status: 400 }
    );
  }

  const followToDelete = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (!followToDelete) {
    return NextResponse.json(
      {
        success: false,
        message: "Aucun abonnement ou demande de suivi correspondant trouvé.",
      },
      { status: 404 }
    );
  }

  const followDeleted = await prisma.follow.delete({
    where: { id: followToDelete.id },
  });

  await prisma.notification.deleteMany({
    where: {
      type: "FOLLOW",
      triggerId: followDeleted.id,
    },
  });

  revalidateTag("follows");

  return NextResponse.json({
    success: true,
    message:
      followDeleted.status === "CONFIRMED"
        ? "Abonnement supprimé avec succès."
        : "Demande de suivi annulée avec succès.",
    data: followDeleted,
  });
}

// =============================================================================
