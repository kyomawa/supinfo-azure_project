import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Comment } from "@prisma/client";
import { auth } from "@/lib/auth";

// =================================================================================================================

export async function GET({ params }: { params: { postId: string } }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Authentification requise.",
          data: null,
        },
        { status: 401 }
      );
    }

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
