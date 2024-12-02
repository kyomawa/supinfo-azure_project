import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateSASURL } from "@/lib/generateSasUrl";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";

// =================================================================================================================

export async function GET(request: NextRequest) {
  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Le paramètre de recherche 'q' est requis.",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
    });

    const usersWithSAS = users.map((user) => ({
      ...user,
      image: user.image ? generateSASURL(user.image) : user.image,
    }));

    return NextResponse.json<ApiResponse<typeof usersWithSAS>>({
      success: true,
      message: "Utilisateurs trouvés avec succès.",
      data: usersWithSAS,
    });
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateurs :", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Erreur lors de la recherche d'utilisateurs.",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =================================================================================================================
