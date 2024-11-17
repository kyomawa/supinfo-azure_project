import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { connexionFailedMetadata } from "@/constants/metadata";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = connexionFailedMetadata;

export default function ConnexionEchoue({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const error = searchParams.error;

  const getErrorMessage = (errorCode: string | undefined) => {
    switch (errorCode) {
      case "OAuthAccountNotLinked":
        return "Un compte existe déjà avec cette adresse e-mail. Veuillez vous connecter avec la plateforme d'origine.";
      case "AccessDenied":
        return "Accès refusé. Vous n'avez pas la permission de vous connecter.";
      case "Verification":
        return "La vérification a échoué. Veuillez réessayer.";
      default:
        return "Une erreur inconnue s'est produite. Veuillez réessayer.";
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <Logo className="size-14 dark:*:stroke-primary-500 mb-4" isLink={false} hideText />
      <h1 className="text-3xl font-bold mb-4">Échec de la connexion</h1>
      <p className="text-lg text-center mb-6 text-neutral-400 dark:text-white/45">{getErrorMessage(error)}</p>
      <Link href="/" className={cn(buttonVariants(), "text-base")}>
        Retour à la page de connexion
      </Link>
    </main>
  );
}
