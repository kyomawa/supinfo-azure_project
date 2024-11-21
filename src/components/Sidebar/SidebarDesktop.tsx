"use client";

import Logo from "@/components/Logo";
import { sidebarLinks } from "@/constants/data";
import { SidebarLinkProps } from "@/constants/type";
import { Link } from "next-view-transitions";
import { motion, Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "../Image";
import TooltipComponent from "../TooltipComponent";
import CreationModal from "../../app/(WebApp)/creation/components/CreationModal";
import { useState } from "react";

// ==================================================================================================================================

type SidebarDesktop = {
  userImage?: string | null;
  username: string;
};

export default function SidebarDesktop({ userImage, username }: SidebarDesktop) {
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  return (
    <aside className="max-md:hidden md:w-[4.75rem] xl:w-64 fixed h-full py-3 top-0 left-0 flex flex-col gap-y-10 border-r border-neutral-150 dark:border-white/10">
      <div className="px-6 py-3">
        <Logo className="size-7 dark:*:stroke-primary-500" textClassName="text-lg max-xl:hidden" path="/" />
      </div>
      <nav className="flex-1 flex justify-between flex-col">
        {/* Show all links except disconnect and settings */}
        <ul className="mx-3">
          {sidebarLinks.map((link, idx) => {
            const skip = ["Se déconnecter", "Paramètres"];
            if (skip.includes(link.label)) return;
            return (
              <SidebarLink
                username={username}
                isCreationModalOpen={isCreationModalOpen}
                setIsCreationModalOpen={setIsCreationModalOpen}
                key={link.label + idx}
                userImage={userImage}
                {...link}
              />
            );
          })}
        </ul>
        {/* Show only disconnect and settings links */}
        <ul className="mx-3">
          {sidebarLinks.map((link, idx) => {
            const unSkip = ["Se déconnecter", "Paramètres"];
            if (!unSkip.includes(link.label)) return;
            return (
              <SidebarLink
                username={username}
                isCreationModalOpen={isCreationModalOpen}
                setIsCreationModalOpen={setIsCreationModalOpen}
                key={link.label + idx}
                {...link}
              />
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

// ==================================================================================================================================

type SidebarLinkPropsActual = SidebarLinkProps & {
  userImage?: string | null;
  setIsCreationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCreationModalOpen: boolean;
  username: string;
};

function SidebarLink({
  username,
  path,
  label,
  onClick,
  icon: Icon,
  userImage,
  setIsCreationModalOpen,
  isCreationModalOpen,
}: SidebarLinkPropsActual) {
  const pathname = usePathname();
  const isActive = path ? (path === "/" ? pathname === path : pathname.startsWith(path)) : false;
  const showAvatar = userImage && label === "Profil";
  const isCreationModal = label === "Création";
  const isProfil = label === "Profil";

  const mustBeHiglighted = isActive && !isCreationModalOpen;

  const renderLinkContent = () => {
    if (path) {
      return (
        <Link
          href={isProfil ? `/profil/${username}` : path}
          className="flex max-xl:justify-center items-center gap-x-3 font-medium py-3.5 px-3"
        >
          {showAvatar ? (
            <Image
              src={userImage}
              className="rounded-full"
              containerClassName="size-6 rounded-full overflow-hidden"
              alt="Avatar de l'utilisateur"
              sizes="1.5rem"
            />
          ) : (
            <Icon
              className={cn(
                "size-6 stroke-[1.75]",
                mustBeHiglighted && "stroke-primary-600 stroke-2 dark:stroke-primary-500"
              )}
            />
          )}
          <span
            className={cn(
              "text-neutral-600 dark:text-white/65 max-xl:hidden",
              mustBeHiglighted && " dark:text-white text-black"
            )}
          >
            {label}
          </span>
        </Link>
      );
    }

    if (isCreationModal) {
      return <CreationModal label={label} isOpen={isCreationModalOpen} setIsOpen={setIsCreationModalOpen} />;
    }

    return (
      <button onClick={onClick} className="flex max-xl:justify-center items-center gap-x-3 font-medium py-3.5 px-3">
        <Icon
          className={cn(
            "size-6 stroke-[1.75]",
            mustBeHiglighted && "stroke-primary-600 stroke-2 dark:stroke-primary-500"
          )}
        />
        <span
          className={cn(
            "text-neutral-600 dark:text-white/65 max-xl:hidden",
            mustBeHiglighted && " dark:text-white text-black"
          )}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <TooltipComponent className="xl:hidden" label={label} side="right" delayDuration={250}>
      <motion.li className="relative cursor-pointer" whileHover="hover">
        {renderLinkContent()}
        <motion.div
          initial={{
            opacity: 0,
          }}
          transition={{
            duration: 0.45,
            type: "spring",
            stiffness: 175,
            damping: 20,
          }}
          variants={sidebarLinkVariants}
          className="absolute inset-0 -z-[1] rounded-md bg-black/5 dark:bg-white/15"
        />
      </motion.li>
    </TooltipComponent>
  );
}

// ==========================================================================================================

const sidebarLinkVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

// ==========================================================================================================
