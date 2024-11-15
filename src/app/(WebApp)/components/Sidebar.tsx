"use client";

import Logo from "@/components/ui/Logo";
import { sidebarLinks } from "@/constants/data";
import { SidebarLinkProps } from "@/constants/type";
import Link from "next/link";
import { motion, Variants } from "motion/react";

export default function Sidebar() {
  return (
    <>
      {/* Sidebar content */}
      <aside className="w-64 fixed h-full py-3 top-0 left-0 flex flex-col gap-y-10 border-r border-neutral-150">
        <div className="px-6 py-3">
          <Logo path="/" />
        </div>
        <nav className="flex-1 flex justify-between flex-col">
          {/* Show all links except disconnect and settings */}
          <ul>
            {sidebarLinks.map((link) => {
              const skip = ["Se déconnecter", "Paramètres"];
              if (skip.includes(link.label)) return;
              return <SidebarLink key={link.path} {...link} />;
            })}
          </ul>
          {/* Show only disconnect and settings links */}
          <ul>
            {sidebarLinks.map((link) => {
              const skip = ["Se déconnecter", "Paramètres"];
              if (!skip.includes(link.label)) return;
              return <SidebarLink key={link.path} {...link} />;
            })}
          </ul>
        </nav>
      </aside>
      {/* Sidebar width */}
      <div className="w-64" />
    </>
  );
}

// ==================================================================================================================================

function SidebarLink({ path, label, icon: Icon }: SidebarLinkProps) {
  return (
    <motion.li className="py-3 mx-6 relative" whileHover="hover">
      {path ? (
        <Link href={path} className="flex items-center gap-x-3 font-medium">
          <Icon className="size-6" />
          <span className="text-neutral-700">{label}</span>
        </Link>
      ) : (
        <button className="flex items-center gap-x-3 font-medium">
          <Icon className="size-6" />
          <span className="text-neutral-700">{label}</span>
        </button>
      )}
      <motion.div
        initial={{
          opacity: 0,
          width: "0",
        }}
        transition={{
          duration: 0.375,
        }}
        variants={sidebarLinkVariants}
        className="absolute bottom-0 left-0 right-0 h-0.5 -z-[1] rounded bg-primary-500"
      />
    </motion.li>
  );
}

// ==========================================================================================================

const sidebarLinkVariants: Variants = {
  hover: {
    width: "100%",
    opacity: 1,
  },
};
