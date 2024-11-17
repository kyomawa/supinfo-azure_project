import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { User } from "@prisma/client";

// =================================================================================================================

export async function GET() {
  try {
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
