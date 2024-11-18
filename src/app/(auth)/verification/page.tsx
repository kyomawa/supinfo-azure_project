import { buttonVariants } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { verificationMetadata } from "@/constants/metadata";
import { cn } from "@/lib/utils";
import Link from "next/link";
import VerificationIllustration from "./components/VerificationIllustration";

export const metadata = verificationMetadata;

// ==================================================================================================================================

export default function Page() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-y-6 px-12 py-8 md:px-24 md:py-16 rounded-2xl shadow shadow-black/[0.0375] bg-white dark:bg-white/5">
        <VerificationIllustration />
        <div className="flex flex-col items-center gap-y-2.5 max-w-[28rem]">
          <h1 className="text-2xl md:text-3xl text-center font-semibold">Un email vous a été envoyé !</h1>
          <p className="md:text-lg text-center text-neutral-400 dark:text-white/55">
            Veuillez vérifier vos emails pour vous connecter à votre compte, n&apos;oubliez pas de vérifier vos spams.
          </p>
        </div>
        <Link
          href="/"
          className={cn(buttonVariants(), "md:max-w-[24rem] max-md:w-72 max-sm:w-56 md:min-w-80 text-base")}
        >
          Revenir à l&apos;accueil
        </Link>
        <div className="mt-12 ">
          <Logo className="size-8 dark:*:stroke-primary-500" isLink={false} />
        </div>
      </div>
    </main>
  );
}

// ==================================================================================================================================
