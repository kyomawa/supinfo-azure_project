import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const verif = verifyRequestHeaders(request);
  if (verif) return verif;

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        posts: true,
        follows: true,
        followedBy: true,
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
