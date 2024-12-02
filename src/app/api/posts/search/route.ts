import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateSASURL } from "@/lib/generateSasUrl";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  if (!query || query.trim().length === 0) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Le paramètre de recherche 'q' est requis.",
        data: null,
      },
      { status: 400 }
    );
  }

  const skip = skipParam ? parseInt(skipParam) : 0;
  const take = takeParam ? parseInt(takeParam) : 9;

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [{ description: { contains: query, mode: "insensitive" } }, { tags: { hasSome: [query] } }],
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

    if (!posts || posts.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Aucune publication trouvée pour cette recherche.",
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
        creator: {
          ...post.creator,
          image: post.creator.image ? generateSASURL(post.creator.image) : post.creator.image,
        },
      };
    });

    return NextResponse.json<ApiResponse<typeof postsWithSAS>>({
      success: true,
      message: "Publications trouvées avec succès.",
      data: postsWithSAS,
    });
  } catch (error) {
    console.error("Erreur lors de la recherche de publications :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors de la recherche de publications.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
