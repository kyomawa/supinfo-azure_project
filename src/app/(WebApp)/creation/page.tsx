import { creationMetadata } from "@/constants/metadata";
import CreationForm from "./components/CreationForm";
import { auth } from "@/lib/auth";

export const metadata = creationMetadata;

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id;

  return (
    <div className="p-6 flex flex-col gap-y-6 specialPostContainer">
      <h1 className="title1">Création</h1>
      <CreationForm userId={userId || ""} />
    </div>
  );
}
