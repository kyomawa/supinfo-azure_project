import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import NavbarMobile from "./NavbarMobile";
import { ensureUserIsAuthenticated } from "@/actions/auth/action";

// ==================================================================================================================================

export default async function Navbar() {
  const userId = await ensureUserIsAuthenticated();

  const res = await get<User>(`user/${userId}`, { tag: "userConnected" });
  const user = res.data;

  return (
    <>
      {/* Navbar Mobile Content */}
      <NavbarMobile userImage={user?.image} />
      {/* Navbar Mobile Height */}
      <div className="md:hidden" />
    </>
  );
}

// ==================================================================================================================================
