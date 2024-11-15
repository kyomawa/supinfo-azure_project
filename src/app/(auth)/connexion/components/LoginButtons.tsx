"use client";

import { useState } from "react";
import LoginWithEmailButton from "./LoginWithEmailButton";
import LoginWithGoogleButton from "./LoginWithGoogleButton";
import LoginWithDiscordButton from "./LoginWithDiscordButton";
import LoginWithMicrosoftButton from "./LoginWithMicrosoftButton";

export default function LoginButtons() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-y-2">
      <LoginWithEmailButton isLoading={isLoading} setIsLoading={setIsLoading} />
      <div className="flex items-center gap-x-2 my-2">
        <div className="h-px w-full flex-1 bg-neutral-200 dark:bg-white/15" />
        <p className="text-center text-neutral-400 dark:text-primary-200/65 font-medium text-sm">OU</p>
        <div className="h-px w-full flex-1 bg-neutral-200 dark:bg-white/15" />
      </div>
      <LoginWithGoogleButton isLoading={isLoading} />
      <LoginWithMicrosoftButton isLoading={isLoading} />
      <LoginWithDiscordButton isLoading={isLoading} />
    </div>
  );
}
