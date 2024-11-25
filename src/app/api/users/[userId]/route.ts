import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { ObjectId } from "mongodb";
import { schemaUpdateProfileForm } from "@/constants/schema";
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

    revalidateTag("users");

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

  const req = await request.json();
  const { success, data, error } = schemaUpdateProfileForm.safeParse(req);

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

  const { name, username, bio } = data;

  const userAlreadyExist = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (userAlreadyExist) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Ce nom d'utilisateur est déjà utilisé.",
        data: null,
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      username,
      bio,
    },
  });

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors de la mise à jour du profil.",
        data: null,
      },
      { status: 404 }
    );
  }

  user.image = user.image ? generateSASURL(user.image) : user.image;

  revalidateTag("users");

  return NextResponse.json<ApiResponse<User>>({
    success: true,
    message: "Image de l'utilisateur mise à jour avec succès.",
    data: user,
  });
}

// =================================================================================================================
