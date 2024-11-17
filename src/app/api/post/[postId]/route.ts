import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@prisma/client";

// =================================================================================================================

export async function GET(_request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        creator: true,
        likes: true,
        comments: true,
      },
    });

    if (!post) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Post non trouvé.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Post>>({
      success: true,
      message: "Post récupéré avec succès.",
      data: post,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du post :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération du post.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
