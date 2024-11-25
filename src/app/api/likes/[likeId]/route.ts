import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { revalidateTag } from "next/cache";
import { Like } from "@prisma/client";

// ==================================================================================================================================

export async function DELETE(request: NextRequest, { params }: { params: { likeId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const { likeId } = params;

  if (!likeId) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Le paramètre 'likeId' est requis.",
        data: null,
      },
      { status: 400 }
    );
  }

  const like = await prisma.like.findUnique({
    where: { id: likeId },
    include: {
      post: {
        select: { creatorId: true },
      },
    },
  });

  if (!like) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Like non trouvé.",
        data: null,
      },
      { status: 404 }
    );
  }

  const likeDeleted = await prisma.like.delete({
    where: { id: likeId },
  });

  if (like.post.creatorId !== like.userId) {
    await prisma.notification.deleteMany({
      where: {
        type: "LIKE",
        triggerId: likeDeleted.id,
      },
    });
  }

  revalidateTag("likes");

  return NextResponse.json<ApiResponse<Like>>(
    {
      success: true,
      message: "Like supprimé avec succès.",
      data: likeDeleted,
    },
    { status: 200 }
  );
}

// ==================================================================================================================================
