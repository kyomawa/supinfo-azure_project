import { loginWithGoogle } from "@/actions/auth/action";
import { Button } from "@/components/ui/button";

// ==================================================================================================================================

type LoginWithGoogleButtonProps = {
  isLoading: boolean;
};

export default function LoginWithGoogleButton({ isLoading }: LoginWithGoogleButtonProps) {
  return (
    <form action={loginWithGoogle}>
      <Button isLoading={isLoading} variant="outline" className="w-full">
        <div className="flex items-center flex-row gap-x-3">
          <GoogleIcon />
          <span>Se connecter avec Google</span>
        </div>
      </Button>
    </form>
  );
}

// ==================================================================================================================================

function GoogleIcon() {
  return (
    <svg className="size-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
        fill="#FFC107"
      />
      <path
        d="M3.15332 7.3455L6.43882 9.755C7.32782 7.554 9.48082 6 12.0003 6C13.5298 6 14.9213 6.577 15.9808 7.5195L18.8093 4.691C17.0233 3.0265 14.6343 2 12.0003 2C8.15932 2 4.82832 4.1685 3.15332 7.3455Z"
        fill="#FF3D00"
      />
      <path
        d="M12.0002 21.9999C14.5832 21.9999 16.9302 21.0114 18.7047 19.4039L15.6097 16.7849C14.5721 17.5744 13.3039 18.0013 12.0002 17.9999C9.39916 17.9999 7.19066 16.3414 6.35866 14.0269L3.09766 16.5394C4.75266 19.7779 8.11366 21.9999 12.0002 21.9999Z"
        fill="#4CAF50"
      />
      <path
        d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
        fill="#1976D2"
      />
    </svg>
  );
}

// ==================================================================================================================================
