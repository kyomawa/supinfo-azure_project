import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Comment } from "@prisma/client";

// =================================================================================================================

export async function GET(_request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.postId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json<ApiResponse<Comment[]>>({
      success: true,
      message: "Commentaires récupérés avec succès.",
      data: comments,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des commentaires.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
