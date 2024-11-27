import NextAuth from "next-auth";
import { prisma } from "./prisma";
import authConfig from "./auth.config";
import Resend from "next-auth/providers/resend";
import { CustomPrismaAdapter } from "./adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Resend({
      from: "contact@supinfo-azure-project.fr",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
    updateAge: 1 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/connexion",
    error: "/connexion-echoue",
    verifyRequest: "/verification",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, profile }) {
      if (!user.username) {
        let generatedUsername = "";

        if (profile?.name) {
          generatedUsername = profile.name.replace(/\s+/g, "").toLowerCase();
        } else if (user.email) {
          generatedUsername = user.email.split("@")[0];
        } else {
          generatedUsername = `user${Math.floor(Math.random() * 10000)}`;
        }

        let isUnique = false;
        let suffix = 0;
        let tempUsername = generatedUsername;

        while (!isUnique) {
          const existingUser = await prisma.user.findUnique({
            where: { username: tempUsername },
          });

          if (!existingUser) {
            isUnique = true;
            generatedUsername = tempUsername;
          } else {
            suffix++;
            tempUsername = `${generatedUsername}${suffix}`;
          }
        }

        user.username = generatedUsername;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      return session;
    },
  },
});
