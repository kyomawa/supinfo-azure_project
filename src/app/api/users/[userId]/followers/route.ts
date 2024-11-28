import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateSASURL } from "@/lib/generateSasUrl";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const followers = await prisma.follow.findMany({
    where: { followingId: params.userId },
    select: {
      follower: true,
      status: true,
    },
  });

  if (!followers) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors de la récupération des utilisateurs suivis.",
        data: null,
      },
      { status: 404 }
    );
  }

  const followersUsers = followers.map((follow) => {
    const user = follow.follower;
    return {
      ...user,
      status: follow.status,
      image: user.image ? generateSASURL(user.image) : user.image,
    };
  });

  return NextResponse.json<ApiResponse<FollowerByUserIdEndpointProps[]>>({
    success: true,
    message: "Liste des utilisateurs suivis récupérée avec succès.",
    data: followersUsers,
  });
}

// =================================================================================================================
