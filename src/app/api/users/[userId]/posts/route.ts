import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { generateSASURL } from "@/lib/generateSasUrl";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam) : 0;
  const take = takeParam ? parseInt(takeParam) : undefined;

  try {
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
      skip,
      take,
    });

    if (!posts || posts.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Aucune publication trouvée pour cet utilisateur.",
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
  } catch (error) {
    console.error("Erreur lors de la récupération des publications :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des publications.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
