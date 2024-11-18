"use client";

import { sidebarLinks } from "@/constants/data";
import { SidebarLinkProps } from "@/constants/type";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "../Image";
import DropdownMenuComponent from "../DropdownMenuComponent";
import { logout } from "@/actions/auth/action";

// ==================================================================================================================================

type NavbarMobileProps = {
  userImage?: string | null;
};

export default function NavbarMobile({ userImage }: NavbarMobileProps) {
  const navbarLinksFiltered = sidebarLinks.filter(
    (link) => link.label !== "Profil" && link.label !== "Se déconnecter" && link.label !== "Paramètres"
  );
  const navbarProfileLink = sidebarLinks.filter((link) => link.label === "Profil")[0];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 px-3 py-1.5 border-t dark:bg-neutral-950 bg-neutral-50 border-neutral-150 dark:border-white/10">
      <ul className="flex justify-between">
        {navbarLinksFiltered.map((link, idx) => (
          <NavbarLink key={link.label + idx} userImage={userImage} {...link} />
        ))}
        <DropdownMenuComponent
          options={[
            <Link
              key="navbar-link-profile"
              href="/profil"
              className="flex items-center gap-x-3 font-medium hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              Profil
            </Link>,
            <Link
              key="navbar-link-parametres"
              href="/parametres"
              className="flex items-center gap-x-3 font-medium hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              Paramètres
            </Link>,
            <button
              key="navbar-link-logout"
              onClick={() => logout()}
              className="flex w-full items-center gap-x-3 font-medium hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              Se déconnecter
            </button>,
          ]}
          label="Menu"
          separator
        >
          <NavbarLink userImage={userImage} {...navbarProfileLink} />
        </DropdownMenuComponent>
      </ul>
    </nav>
  );
}

// =======================================================================================================================================

type NavbarLinkProps = SidebarLinkProps & {
  userImage?: string | null;
};

function NavbarLink({ path, label, icon: Icon, userImage }: NavbarLinkProps) {
  const pathname = usePathname();
  const profilePaths = ["/parametres", "/profil"];

  let isActive = false;

  if (path) {
    if (profilePaths.includes(path)) {
      isActive = profilePaths.includes(pathname);
    } else {
      isActive = path === "/" ? pathname === path : pathname.startsWith(path);
    }
  }
  const showAvatar = userImage && label === "Profil";

  return (
    <li
      className={cn(
        "relative cursor-pointer",
        isActive &&
          "after:rounded-full after:bg-primary-600 after:h-1 after:w-full after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2"
      )}
    >
      <Link href={path || ""} className="flex max-xl:justify-center items-center gap-x-3 p-3 font-medium">
        {showAvatar ? (
          <Image
            src={userImage}
            className="rounded-full"
            containerClassName="size-6 rounded-full overflow-hidden"
            loadingClassName=""
            alt="Avatar de l'utilisateur"
            sizes="1.5rem"
          />
        ) : (
          <Icon className="size-6 stroke-[1.75]" />
        )}
      </Link>
    </li>
  );
}

// ==========================================================================================================
