import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import SidebarDesktop from "./SidebarDesktop";
import { auth } from "@/lib/auth";

// ==================================================================================================================================

export default async function Sidebar() {
  const session = await auth();
  const userId = session?.user?.id;

  const res = await get<User>(`users/${userId}`, { tag: "userConnected" });
  const user = res.data;
  return (
    <>
      {/* Sidebar content */}
      <SidebarDesktop userImage={user?.image} />
      {/* Sidebar width */}
      <div className="max-md:hidden md:w-[4.75rem] xl:w-64" />
    </>
  );
}

// ==================================================================================================================================
