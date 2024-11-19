import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Comment } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { commentId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
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
