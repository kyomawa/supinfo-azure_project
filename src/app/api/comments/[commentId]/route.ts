import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Comment } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { schemaNewCommentForm } from "@/constants/schema";
import { revalidateTag } from "next/cache";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { commentId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      include: { user: true, post: true },
    });

    if (!comment) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Commentaire non trouvé.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Comment>>({
      success: true,
      message: "Commentaire récupéré avec succès.",
      data: comment,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération du commentaire.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================

export async function DELETE(request: NextRequest, { params }: { params: { commentId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const { commentId } = params;

  if (!commentId) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Le paramètre 'commentId' est requis.",
        data: null,
      },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });

  if (!comment) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Commentaire non trouvé.",
        data: null,
      },
      { status: 404 }
    );
  }

  await prisma.notification.deleteMany({
    where: {
      triggerId: commentId,
      type: "COMMENT",
    },
  });

  const commentDeleted = await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidateTag(`post-${comment.post.creatorId}-comments`);
  revalidateTag(`user-${comment.post.creatorId}-posts`);

  return NextResponse.json<ApiResponse<Comment>>(
    {
      success: true,
      message: "Commentaire supprimé avec succès.",
      data: commentDeleted,
    },
    { status: 200 }
  );
}

// =================================================================================================================

export async function PATCH(request: NextRequest, { params }: { params: { commentId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const { commentId } = params;

  if (!commentId) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Le paramètre 'commentId' est requis.",
        data: null,
      },
      { status: 400 }
    );
  }

  const req = await request.json();
  const parsed = schemaNewCommentForm.safeParse(req);

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

  const { content } = parsed.data;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Commentaire non trouvé.",
        data: null,
      },
      { status: 404 }
    );
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
      updatedAt: new Date(),
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json<ApiResponse<typeof updatedComment>>(
    {
      success: true,
      message: "Commentaire mis à jour avec succès.",
      data: updatedComment,
    },
    { status: 200 }
  );
}

// =================================================================================================================
