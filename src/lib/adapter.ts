import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Adapter, AdapterUser } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const originalAdapter = PrismaAdapter(prisma);

  return {
    ...originalAdapter,
    async createUser(user) {
      if (!user.username) {
        throw new Error("Username is required but was not provided.");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...userData } = user;
      const createdUser = await prisma.user.create({
        data: {
          ...userData,
          username: user.username,
        },
      });

      return {
        ...createdUser,
        email: createdUser.email || undefined,
      } as AdapterUser;
    },
  };
}
