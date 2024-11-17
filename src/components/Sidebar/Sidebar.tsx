import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import SidebarDesktop from "./SidebarDesktop";
import { ensureUserIsAuthenticated } from "@/actions/auth/action";

// ==================================================================================================================================

export default async function Sidebar() {
  const userId = await ensureUserIsAuthenticated();

  const res = await get<User>(`user/${userId}`, { tag: "userConnected" });
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
