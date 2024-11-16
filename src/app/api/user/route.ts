import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { auth } from "@/lib/auth";

// =================================================================================================================

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Authentification requise.",
          data: null,
        },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany();

    return NextResponse.json<ApiResponse<User[]>>({
      success: true,
      message: "Les utilisateurs ont été récupérés avec succès.",
      data: users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la récupération des utilisateurs.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
