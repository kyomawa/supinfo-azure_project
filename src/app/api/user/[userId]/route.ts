import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@prisma/client";

export const dynamic = "force-static";
export const revalidate = 3600;

// =================================================================================================================

export async function GET(_request: NextRequest, { params }: { params: { userId: string } }) {
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

export async function DELETE(_request: NextRequest, { params }: { params: { userId: string } }) {
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
