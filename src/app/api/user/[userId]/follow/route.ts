import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@prisma/client";

// =================================================================================================================

export async function GET(_request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: params.userId },
      include: { following: true },
    });

    const followingUsers = following.map((follow) => follow.following);

    return NextResponse.json<ApiResponse<User[]>>({
      success: true,
      message: "Liste des utilisateurs suivis récupérée avec succès.",
      data: followingUsers,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs suivis :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des utilisateurs suivis.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
