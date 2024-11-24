import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { revalidateTag } from "next/cache";

// ==================================================================================================================================

export async function POST(request: NextRequest) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const { userId, postId } = await request.json();

  if (!userId || !postId) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Les paramètres 'userId' et 'postId' sont requis.",
        data: null,
      },
      { status: 400 }
    );
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingLike) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Vous avez déjà liké ce post.",
        data: null,
      },
      { status: 400 }
    );
  }

  const newLike = await prisma.like.create({
    data: {
      userId,
      postId,
    },
    include: {
      user: true,
    },
  });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { creatorId: true },
  });

  if (post && post.creatorId !== userId) {
    await prisma.notification.create({
      data: {
        content: `a aimé votre publication.`,
        userId: post.creatorId,
        actorId: userId,
      },
    });
  }

  revalidateTag(`post-${postId}-likes`);

  return NextResponse.json<ApiResponse<typeof newLike>>(
    {
      success: true,
      message: "Post liké avec succès.",
      data: newLike,
    },
    { status: 201 }
  );
}

// ==================================================================================================================================
