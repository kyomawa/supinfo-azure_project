import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { generateSASURL } from "@/lib/generateSasUrl";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const followings = await prisma.follow.findMany({
    where: { followerId: params.userId },
    select: {
      following: true,
      status: true,
    },
  });

  if (!followings) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors de la récupération des utilisateurs suivis.",
        data: null,
      },
      { status: 404 }
    );
  }

  const followingUsers = followings.map((follow) => {
    const user = follow.following;
    return {
      ...user,
      status: follow.status,
      image: user.image ? generateSASURL(user.image) : user.image,
    };
  });

  return NextResponse.json<ApiResponse<FollowingByUserIdEndpointProps[]>>({
    success: true,
    message: "Liste des utilisateurs suivis récupérée avec succès.",
    data: followingUsers,
  });
}

// =================================================================================================================
