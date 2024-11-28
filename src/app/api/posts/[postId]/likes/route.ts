import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateSASURL } from "@/lib/generateSasUrl";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const likes = await prisma.like.findMany({
      where: { postId: params.postId },
      select: {
        id: true,
        user: true,
      },
    });

    if (!likes) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Erreur lors de la récupération des likes.",
          data: null,
        },
        { status: 404 }
      );
    }

    likes.forEach((like) => {
      like.user.image = like.user.image ? generateSASURL(like.user.image) : like.user.image;
    });

    return NextResponse.json<ApiResponse<LikesWithUsersByPostIdEndpointProps[]>>({
      success: true,
      message: "Likes récupérés avec succès.",
      data: likes,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des likes :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des likes.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
