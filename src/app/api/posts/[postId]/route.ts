import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { revalidateTag } from "next/cache";
import { deleteMediaFromAzure } from "@/lib/deleteMediaFromAzure";
import { schemaEditPostForm } from "@/constants/schema";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        creator: true,
        likes: true,
        comments: true,
      },
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

    return NextResponse.json<ApiResponse<Post>>({
      success: true,
      message: "Post récupéré avec succès.",
      data: post,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du post :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération du post.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================

export async function DELETE(request: NextRequest, { params }: { params: { postId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const { postId } = params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return NextResponse.json(
      {
        success: false,
        message: "Post non trouvé.",
        data: null,
      },
      { status: 404 }
    );
  }

  // Supprimer le média associé
  if (post.mediaUrl) {
    await deleteMediaFromAzure(post.mediaUrl);
  }

  const postDeleted = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  if (!postDeleted) {
    return NextResponse.json(
      {
        success: false,
        message: "Échec de la suppression du post.",
        data: null,
      },
      { status: 500 }
    );
  }

  revalidateTag("posts");

  return NextResponse.json(
    {
      success: true,
      message: "Post supprimé avec succès.",
      data: null,
    },
    { status: 200 }
  );
}

// =================================================================================================================

export async function PATCH(request: NextRequest, { params }: { params: { postId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const req = await request.json();

  const { success, error, data } = schemaEditPostForm.safeParse(req);

  if (!success) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
        data: null,
      },
      { status: 400 }
    );
  }

  const { postId } = params;

  const { description, tags } = data;

  const tagsArray = tags
    ? tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

  const postUpdated = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      description,
      tags: tagsArray,
    },
    include: {
      creator: true,
      likes: true,
      comments: true,
    },
  });

  if (!postUpdated) {
    return NextResponse.json(
      {
        success: false,
        message: "Échec de la mise à jour du post.",
        data: null,
      },
      { status: 500 }
    );
  }

  revalidateTag("posts");

  return NextResponse.json(
    {
      success: true,
      message: "Post mis à jour avec succès.",
      data: postUpdated,
    },
    { status: 200 }
  );
}

// =================================================================================================================
