"use server";

import { auth, signIn, signOut } from "@/lib/auth";

// ==================================================================================================================================

export const loginWithEmail = async (email: string) => {
  const formData = new FormData();
  formData.append("email", email);
  await signIn("resend", formData);
};

// ==================================================================================================================================

export const loginWithGoogle = async () => {
  await signIn("google");
};

// ==================================================================================================================================

export const loginWithDiscord = async () => {
  await signIn("discord");
};

// ==================================================================================================================================

export const loginWithMicrosoft = async () => {
  await signIn("microsoft-entra-id");
};

// ==================================================================================================================================

export const logout = async () => {
  await signOut();
};

// ==================================================================================================================================

export const ensureUserIsAuthenticated = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Vous devez être connecté pour effectuer une action.");
  }
  return session.user.id;
};

// ==================================================================================================================================
