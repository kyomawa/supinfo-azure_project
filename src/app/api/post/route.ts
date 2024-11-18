import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";

// ==================================================================================================================================

export async function GET(request: NextRequest) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam) : 0;
  const take = takeParam ? parseInt(takeParam) : undefined;

  try {
    const posts = await prisma.post.findMany({
      include: {
        creator: true,
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
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

// ==================================================================================================================================
