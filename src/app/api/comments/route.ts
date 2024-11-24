import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { schemaNewCommentFormJson } from "@/constants/schema";

// ==================================================================================================================================

export async function POST(request: NextRequest) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const req = await request.json();
  const parsed = schemaNewCommentFormJson.safeParse(req);

  if (!parsed.success) {
    const errors = parsed.error.errors.map((e) => e.message).join(", ");
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: `Erreur dans les données fournies : ${errors}`,
        data: null,
      },
      { status: 400 }
    );
  }

  const { postId, content, userId } = parsed.data;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { creatorId: true },
  });

  if (!post) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Post non trouvé.",
        data: null,
      },
      { status: 404 }
    );
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId,
    },
    include: {
      user: true,
    },
  });

  if (post.creatorId !== userId) {
    await prisma.notification.create({
      data: {
        content: "a commenté votre publication",
        userId: post.creatorId,
        actorId: userId,
        commentId: newComment.id,
      },
    });
  }

  return NextResponse.json<ApiResponse<typeof newComment>>(
    {
      success: true,
      message: "Commentaire ajouté avec succès.",
      data: newComment,
    },
    { status: 201 }
  );
}

// ==================================================================================================================================
