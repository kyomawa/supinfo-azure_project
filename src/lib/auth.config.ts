import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftEntraID({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  trustHost: true,
};

export default authConfig;
