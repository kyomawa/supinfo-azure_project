import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Like } from "@prisma/client";

// =================================================================================================================

export async function GET(_request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const likes = await prisma.like.findMany({
      where: { postId: params.postId },
      include: { user: true },
    });

    return NextResponse.json<ApiResponse<Like[]>>({
      success: true,
      message: "Likes récupérés avec succès.",
      data: likes,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des likes :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des likes.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
