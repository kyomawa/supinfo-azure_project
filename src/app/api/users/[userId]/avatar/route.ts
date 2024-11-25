import { schemaUpdateProfileImageFormData } from "@/constants/schema";
import { prisma } from "@/lib/prisma";
import { uploadMediaToAzure } from "@/lib/uploadMediaToAzure";
import { verifyRequestHeaders } from "@/utils/verifyRequestHeaders";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// ==================================================================================================================================

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

// ==================================================================================================================================
