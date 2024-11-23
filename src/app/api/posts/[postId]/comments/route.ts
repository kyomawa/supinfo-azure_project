import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { generateSASURL } from "@/lib/generateSasUrl";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.postId },
      select: {
        content: true,
        createdAt: true,
        id: true,
        user: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!comments) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Erreur lors de la récupération des commentaires.",
          data: null,
        },
        { status: 404 }
      );
    }

    comments.forEach((comment) => {
      comment.user.image = comment.user.image ? generateSASURL(comment.user.image) : comment.user.image;
    });

    return NextResponse.json<ApiResponse<CommentsWithUsersByPostIdEndpointProps[]>>({
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
