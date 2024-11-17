import { auth } from "@/lib/auth";
import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const res = await get<User>(`user/${userId}`, { tag: "userConnected" });
  const user = res.data;

  return (
    <div>
      <h1>SettingsPage</h1>
    </div>
  );
}
