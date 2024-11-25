import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { generateSASURL } from "@/lib/generateSasUrl";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const posts = await prisma.post.findMany({
    where: { creatorId: params.userId },
    select: {
      id: true,
      mediaUrl: true,
      createdAt: true,
      likes: true,
      comments: true,
      description: true,
      tags: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!posts) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors de la récupération des publications de l'utilisateur.",
        data: null,
      },
      { status: 404 }
    );
  }

  const postsWithSAS = posts.map((post) => {
    const isAVideo = post.mediaUrl.includes("/videos/");
    const thumbnailUrl = isAVideo ? post.mediaUrl.replace("/videos/", "/thumbnails/").replace(".webm", ".jpg") : "";

    return {
      ...post,
      mediaUrl: post.mediaUrl ? generateSASURL(post.mediaUrl) : "",
      videoThumbnail: thumbnailUrl ? generateSASURL(thumbnailUrl) : "",
    };
  });

  return NextResponse.json<ApiResponse<PostsByUserIdEndpointProps[]>>({
    success: true,
    message: "Liste des publications récupérées avec succès.",
    data: postsWithSAS,
  });
}

// =================================================================================================================
