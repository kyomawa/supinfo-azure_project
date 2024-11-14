"use server";

import { signIn } from "@/lib/auth";

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
