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
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      profilePhotoSize: 360,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "openid profile email offline_access User.Read",
        },
      },
    }),
  ],
  trustHost: true,
};

export default authConfig;
