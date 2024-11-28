import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { deleteMediaFromAzure } from "@/lib/deleteMediaFromAzure";
import { schemaEditPostForm } from "@/constants/schema";
import { generateSASURL } from "@/lib/generateSasUrl";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: {
        id: true,
        mediaUrl: true,
        createdAt: true,
        description: true,
        tags: true,
        creator: true,
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

    post.mediaUrl = post.mediaUrl ? generateSASURL(post.mediaUrl) : post.mediaUrl;
    post.creator.image = post.creator.image ? generateSASURL(post.creator.image) : post.creator.image;

    return NextResponse.json<ApiResponse<PostWithCreatorByPostIdEndpointProps>>({
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
  const verif = await verifyRequestHeaders(request);
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

  await prisma.notification.deleteMany({
    where: {
      type: "POST",
      triggerId: postId,
    },
  });

  revalidateTag("posts");

  return NextResponse.json(
    {
      success: true,
      message: "Post supprimé avec succès.",
      data: postDeleted,
    },
    { status: 200 }
  );
}

// =================================================================================================================

export async function PATCH(request: NextRequest, { params }: { params: { postId: string } }) {
  const verif = await verifyRequestHeaders(request);
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
