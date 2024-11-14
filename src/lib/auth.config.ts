import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

const authConfig: NextAuthConfig = {
  providers: [Google, Facebook],
  trustHost: true,
};

export default authConfig;
