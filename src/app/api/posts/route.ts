import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { schemaCreatePostFormData } from "@/constants/schema";
import { uploadMediaToAzure } from "@/lib/uploadMediaToAzure";
import { generateSASURL } from "@/lib/generateSasUrl";
import { revalidateTag } from "next/cache";

// ==================================================================================================================================

export async function GET(request: NextRequest) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam) : 0;
  const take = takeParam ? parseInt(takeParam) : undefined;

  try {
    const posts = await prisma.post.findMany({
      include: {
        creator: true,
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    const postsWithSAS = posts.map((post) => ({
      ...post,
      creator: {
        ...post.creator,
        image: post.creator.image ? generateSASURL(post.creator.image) : "",
      },
      mediaUrl: post.mediaUrl ? generateSASURL(post.mediaUrl) : "",
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
  const verif = verifyRequestHeaders(request);
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
