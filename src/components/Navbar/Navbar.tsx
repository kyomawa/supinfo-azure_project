import { auth } from "@/lib/auth";
import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import NavbarMobile from "./NavbarMobile";

// ==================================================================================================================================

export default async function Navbar() {
  const session = await auth();
  const userId = session?.user?.id;

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
