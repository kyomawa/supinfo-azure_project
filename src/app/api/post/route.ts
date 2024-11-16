import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Post } from "@prisma/client";
import { auth } from "@/lib/auth";

// =================================================================================================================

export async function GET() {
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

    const posts = await prisma.post.findMany({
      include: {
        creator: true,
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse<Post[]>>({
      success: true,
      message: "Posts récupérés avec succès.",
      data: posts,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des posts.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
