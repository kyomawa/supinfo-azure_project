import { settingsMetadata } from "@/constants/metadata";
import { ensureUserIsAuthenticated } from "@/actions/auth/action";
import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import UserCard from "./components/UserCard";

export const metadata = settingsMetadata;

export default async function Page() {
  const userId = await ensureUserIsAuthenticated();

  const res = await get<User>(`user/${userId}`, { tag: "userConnected" });
  const user = res.data;

  if (!user) throw new Error("Vous devez être connecté pour accéder à cette page.");

  return (
    <div className="p-6 flex flex-col gap-y-6">
      <h1 className="title1">Paramètres</h1>
      <UserCard user={user} />
    </div>
  );
}
