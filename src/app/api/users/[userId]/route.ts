import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { ObjectId } from "mongodb";
import { schemaUpdateProfileImageFormData } from "@/constants/schema";
import { uploadMediaToAzure } from "@/lib/uploadMediaToAzure";
import { revalidateTag } from "next/cache";
import { generateSASURL } from "@/lib/generateSasUrl";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const isObjectId = ObjectId.isValid(params.userId);
    const conditions = [];

    if (isObjectId) {
      conditions.push({ id: params.userId });
    }
    conditions.push({ username: params.userId }, { email: params.userId });

    const user = await prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Utilisateur non trouvé.",
          data: null,
        },
        { status: 404 }
      );
    }

    user.image = user.image ? generateSASURL(user.image) : user.image;

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      message: "Utilisateur récupéré avec succès.",
      data: user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération de l'utilisateur.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const user = await prisma.user.delete({
      where: { id: params.userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Utilisateur non trouvé.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      message: "Utilisateur supprimé avec succès.",
      data: user,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la suppression de l'utilisateur.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  const formData = await request.formData();
  const { success, data, error } = schemaUpdateProfileImageFormData.safeParse(formData);

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

  const { image } = data;

  const folderPath = `users/${userId}`;

  const imageUrl = await uploadMediaToAzure(image, folderPath);

  if (!imageUrl) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors du téléchargement du fichier.",
        data: null,
      },
      { status: 500 }
    );
  }

  const isObjectId = ObjectId.isValid(userId);
  const conditions = isObjectId ? { id: userId } : { OR: [{ username: userId }, { email: userId }] };

  const user = await prisma.user.findFirst({
    where: conditions,
  });

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Utilisateur non trouvé.",
        data: null,
      },
      { status: 404 }
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      image: imageUrl,
    },
  });

  revalidateTag("users");

  return NextResponse.json<ApiResponse<typeof updatedUser>>({
    success: true,
    message: "Image de l'utilisateur mise à jour avec succès.",
    data: updatedUser,
  });
}

// =================================================================================================================
