import { settingsMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import UserCard from "./components/UserCard";
import { auth } from "@/lib/auth";
import SettingsCard from "./components/SettingsCard";

export const metadata = settingsMetadata;

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  const res = await get<User>(`users/${userId}`, { tag: "users" });
  const user = res.data;

  if (!user) throw new Error("Vous devez être connecté pour accéder à cette page.");

  return (
    <div className="p-6 flex flex-col gap-y-6">
      <h1 className="title1">Paramètres</h1>
      <UserCard user={user} />
      <SettingsCard user={user} />
    </div>
  );
}
