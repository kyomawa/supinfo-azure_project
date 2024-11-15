import { loginWithMicrosoft } from "@/actions/auth/action";
import { Button } from "@/components/ui/button";

// ==================================================================================================================================

type LoginWithMicrosoftButtonProps = {
  isLoading: boolean;
};

export default function LoginWithMicrosoftButton({ isLoading }: LoginWithMicrosoftButtonProps) {
  return (
    <form action={loginWithMicrosoft}>
      <Button isLoading={isLoading} variant="outline" className="w-full">
        <div className="flex items-center flex-row gap-x-3">
          <MicrosoftIcon />
          <span>Se connecter avec Microsoft</span>
        </div>
      </Button>
    </form>
  );
}

// ==================================================================================================================================

function MicrosoftIcon() {
  return (
    <svg className="size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4062 11.4062H0V0H11.4062V11.4062Z" fill="#F1511B" />
      <path d="M24 11.4062H12.5939V0H24V11.4062Z" fill="#80CC28" />
      <path d="M11.4059 24.0002H0V12.594H11.4059V24.0002Z" fill="#00ADEF" />
      <path d="M24 24.0002H12.5939V12.594H24V24.0002Z" fill="#FBBC09" />
    </svg>
  );
}

// ==================================================================================================================================
