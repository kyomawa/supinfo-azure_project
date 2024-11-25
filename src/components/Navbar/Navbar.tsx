import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import NavbarMobile from "./NavbarMobile";
import { auth } from "@/lib/auth";

// ==================================================================================================================================

export default async function Navbar() {
  const session = await auth();
  const userId = session?.user?.id;

  const res = await get<User>(`users/${userId}`, {
    tags: ["users", `user-${userId}`, "userConnected"],
    revalidateTime: 180,
  });
  const user = res.data;

  return (
    <>
      {/* Navbar Mobile Content */}
      <NavbarMobile userImage={user?.image} username={user?.username || ""} />
      {/* Navbar Mobile Height */}
      <div className="md:hidden w-full h-[4.3125rem]" />
    </>
  );
}

// ==================================================================================================================================
