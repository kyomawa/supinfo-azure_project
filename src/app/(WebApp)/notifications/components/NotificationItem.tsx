"use client";

import Image from "@/components/Image";
import UserIcon from "@/components/UserIcon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatTimeAgo } from "@/lib/utils";
import { motion, Variants } from "motion/react";
import { Link } from "next-view-transitions";

// ==================================================================================================================================

type NotificationItemProps = {
  notification: NotificationByUserIdEndpointProps;
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { content, createdAt, actor } = notification;
  const { username, image } = actor;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const createdSince = formatTimeAgo(createdAt);

  return (
    <motion.li className="relative cursor-pointer p-3" whileHover={isDesktop ? "hover" : ""}>
      <Link className="flex gap-x-3 items-center" href={`/profil/${actor.username}`}>
        {image ? (
          <Image
            src={image}
            alt={`Avatar de ${username}`}
            containerClassName="rounded-full size-10 shrink-0"
            className="rounded-full"
            sizes="2rem"
          />
        ) : (
          <UserIcon className="rounded-full size-10 shrink-0" />
        )}

        <div className="flex flex-col">
          <div className="text-sm line-clamp-3">
            <span className="font-bold">{username}</span> {content}
          </div>
          <div className="text-xs text-gray-500">{createdSince}</div>
        </div>
      </Link>

      {/* Hover Background */}
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
        variants={notificationLinkVariants}
        className="absolute inset-0 -z-[1] rounded-md bg-black/5 dark:bg-white/15"
      />
    </motion.li>
  );
}

// =================================================================================================================================

const notificationLinkVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

// =================================================================================================================================
