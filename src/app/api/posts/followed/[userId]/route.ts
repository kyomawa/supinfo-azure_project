import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { generateSASURL } from "@/lib/generateSasUrl";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const { userId } = params;

  if (!userId) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Utilisateur non authentifié.",
        data: null,
      },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam) : 0;
  const take = takeParam ? parseInt(takeParam) : undefined;

  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = follows.map((follow) => follow.followingId);
    followingIds.push(userId);

    const posts = await prisma.post.findMany({
      where: {
        creatorId: { in: followingIds },
      },
      include: {
        creator: true,
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    const postsWithSAS = posts.map((post) => ({
      ...post,
      creator: {
        ...post.creator,
        image: post.creator.image ? generateSASURL(post.creator.image) : "",
      },
      mediaUrl: post.mediaUrl ? generateSASURL(post.mediaUrl) : "",
    }));

    return NextResponse.json<ApiResponse<typeof posts>>({
      success: true,
      message: "Publications des utilisateurs suivis récupérées avec succès.",
      data: postsWithSAS,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des publications suivies :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des publications suivies.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
