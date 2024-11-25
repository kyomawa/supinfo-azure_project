import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import SidebarDesktop from "./SidebarDesktop";
import { auth } from "@/lib/auth";

// ==================================================================================================================================

export default async function Sidebar() {
  const session = await auth();
  const userId = session?.user?.id;

  const res = await get<User>(`users/${userId}`, {
    tags: ["users", `user-${userId}`, "userConnected"],
    revalidateTime: 180,
  });
  const user = res.data;
  return (
    <>
      {/* Sidebar content */}
      <SidebarDesktop userImage={user?.image} username={user?.username || ""} />
      {/* Sidebar width */}
      <div className="max-md:hidden md:w-[4.75rem] xl:w-64" />
    </>
  );
}

// ==================================================================================================================================
