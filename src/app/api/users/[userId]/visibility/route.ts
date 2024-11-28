import { schemaSettingsCardVisibilityForm } from "@/constants/schema";
import { prisma } from "@/lib/prisma";
import verifyRequestHeaders from "@/utils/verifyRequestHeaders";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// =================================================================================================================

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const verif = await verifyRequestHeaders(request);
  if (verif) return verif;

  const res = await request.json();
  const { success, data, error } = schemaSettingsCardVisibilityForm.safeParse(res);

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

  const { visibility } = data;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      visibility,
    },
  });

  if (!updatedUser) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Échec de la mise à jour de l'utilisateur.",
        data: null,
      },
      { status: 500 }
    );
  }

  revalidateTag("users");

  return NextResponse.json<ApiResponse<typeof updatedUser>>({
    success: true,
    message: "Visibilité de l'utilisateur mise à jour avec succès.",
    data: updatedUser,
  });
}

// =================================================================================================================
