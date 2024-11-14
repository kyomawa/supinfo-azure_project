import { connexionMetadata } from "@/constants/metadata";
import { Metadata } from "next";
import LoginButtons from "./components/LoginButtons";
import Logo from "@/components/ui/Logo";

export const metadata: Metadata = connexionMetadata;

export default function Page() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 h-screen p-4">
      {/* Form */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-y-12 max-w-[95%] sm:max-w-[80%] md:max-w-[65%] 2xl:max-w-[50%]">
          <div className="flex justify-center">
            <Logo className="size-14" isLink={false} hideText />
          </div>
          <div className="flex flex-col items-center gap-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold">Se Connecter</h1>
            <p className="font-roboto sm:text-lg text-neutral-400 dark:text-primary-200/65 leading-6 text-center">
              Connectez-vous à votre compte SupInfo-Azure-Project.
            </p>
          </div>
          {/* Buttons & Form */}
          <LoginButtons />
          <div className="border-t border-neutral-200 dark:border-white/15 py-4 flex justify-center">
            <p className="text-neutral-400 dark:text-primary-200/65 text-sm font-roboto">
              © 2024 SupInfo-Azure-Project. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
      {/* Banner */}
      <Banner />
    </main>
  );
}

// ==================================================================================================================================

function Banner() {
  return <div className="bg-primary-700 dark:bg-primary-800 rounded-xl max-lg:hidden relative"></div>;
}

// ==================================================================================================================================
