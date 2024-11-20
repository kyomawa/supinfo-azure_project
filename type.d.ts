import { Prisma } from "@prisma/client";

declare global {
  type ApiResponse<T> = { success: true; message: string; data: T } | { success: false; message: string; data: null };

  type PostEndpointProps = Prisma.PostGetPayload<{
    include: { comments: true; likes: true; creator: true };
  }>;
}
