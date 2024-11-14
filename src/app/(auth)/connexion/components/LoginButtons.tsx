"use client";

import { useState } from "react";
import LoginWithEmailButton from "./LoginWithEmailButton";
import LoginWithGoogleButton from "./LoginWithGoogleButton";

export default function LoginButtons() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-y-2">
      <LoginWithEmailButton isLoading={isLoading} setIsLoading={setIsLoading} />
      <LoginWithGoogleButton isLoading={isLoading} />
    </div>
  );
}
