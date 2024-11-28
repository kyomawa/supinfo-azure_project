import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@prisma/client";
import { schemaCreatePostFormData } from "@/constants/schema";
import { uploadMediaToAzure } from "@/lib/uploadMediaToAzure";
import { generateSASURL } from "@/lib/generateSasUrl";
import { revalidateTag } from "next/cache";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// ==================================================================================================================================

export async function GET(request: NextRequest) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam) : 0;
  const take = takeParam ? parseInt(takeParam) : undefined;

  try {
    const posts = await prisma.post.findMany({
      where: {
        creator: {
          visibility: "PUBLIC",
        },
      },
      include: {
        creator: true,
        likes: { include: { user: true } },
        comments: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    const postsWithSAS = posts.map((post) => ({
      ...post,
      creator: {
        ...post.creator,
        image: post.creator.image ? generateSASURL(post.creator.image) : post.creator.image,
      },
      comments: post.comments.map((comment) => ({
        ...comment,
        creator: {
          ...comment.user,
          image: comment.user.image ? generateSASURL(comment.user.image) : comment.user.image,
        },
      })),
      mediaUrl: post.mediaUrl ? generateSASURL(post.mediaUrl) : post.mediaUrl,
    }));

    return NextResponse.json<ApiResponse<Post[]>>({
      success: true,
      message: "Posts récupérés avec succès.",
      data: postsWithSAS,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des posts.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// ==================================================================================================================================

export async function POST(request: NextRequest) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const formData = await request.formData();
  const { success, data, error } = schemaCreatePostFormData.safeParse(formData);

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

  const { file, description, tags, creatorId } = data;

  const folderPath = `posts/${creatorId}`;

  const mediaUrl = await uploadMediaToAzure(file, folderPath);

  if (!mediaUrl) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors du téléchargement du fichier.",
        data: null,
      },
      { status: 500 }
    );
  }

  const post = await prisma.post.create({
    data: {
      description,
      mediaUrl,
      tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
      creatorId,
    },
  });

  const followers = await prisma.follow.findMany({
    where: { followingId: creatorId },
    select: { followerId: true },
  });

  if (followers.length > 0) {
    await prisma.notification.createMany({
      data: followers.map((follower) => ({
        content: "a publié une nouvelle publication",
        type: "POST",
        triggerId: post.id,
        userId: follower.followerId,
        actorId: creatorId,
      })),
    });
  }

  revalidateTag("posts");

  return NextResponse.json<ApiResponse<Post>>(
    {
      success: true,
      message: "Post créé avec succès.",
      data: post,
    },
    { status: 201 }
  );
}

// ==================================================================================================================================
