import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Comment } from "@prisma/client";
import { auth } from "@/lib/auth";

// =================================================================================================================

export async function GET({ params }: { params: { commentId: string } }) {
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

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      include: { user: true, post: true },
    });

    if (!comment) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Commentaire non trouvé.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Comment>>({
      success: true,
      message: "Commentaire récupéré avec succès.",
      data: comment,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération du commentaire.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
