import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const authConfig: NextAuthConfig = {
  providers: [Google],
};

export default authConfig;
