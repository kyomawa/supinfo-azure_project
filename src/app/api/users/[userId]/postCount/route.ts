import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==================================================================================================================================

export async function GET(_request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Utilisateur introuvable.",
        data: null,
      },
      { status: 404 }
    );
  }

  const postCount = await prisma.post.count({ where: { creatorId: userId } });

  return NextResponse.json({
    success: true,
    message: "Nombre de posts récupéré avec succès.",
    data: postCount,
  });
}

// ==================================================================================================================================
