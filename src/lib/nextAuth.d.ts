import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    username?: string;
  }

  interface Session extends DefaultSession {
    user: User;
    accessToken?: string;
    idToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    id?: string;
    accessToken?: string;
    idToken?: string;
  }
}
