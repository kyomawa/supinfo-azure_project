"use client";

import Image from "@/components/Image";
import TooltipComponent from "@/components/TooltipComponent";
import { Button } from "@/components/ui/button";
import UserIcon from "@/components/UserIcon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatTimeAgo } from "@/lib/utils";
import { del, post } from "@/utils/apiFn";
import { Check, X } from "lucide-react";
import { motion, Variants } from "motion/react";
import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import { useState } from "react";
import toast from "react-hot-toast";

// ==================================================================================================================================

type NotificationItemProps = {
  notification: NotificationByUserIdEndpointProps;
  updateNotificationContent: (notificationId: string, newContent: string) => void;
  removeNotification: (notificationId: string) => void;
};

export default function NotificationItem({
  notification,
  updateNotificationContent,
  removeNotification,
}: NotificationItemProps) {
  const { content, createdAt, actor, type, id: notificationId } = notification;
  const { username, image } = actor;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const createdSince = formatTimeAgo(createdAt);

  return (
    <motion.li
      className="relative cursor-pointer p-3 flex gap-x-3 justify-between"
      whileHover={isDesktop ? "hover" : ""}
    >
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

      {type === "FOLLOW" && content === "vous a envoyé une demande de suivi" && (
        <ActionFollowNotification
          notificationId={notificationId}
          followerId={actor.id}
          updateNotificationContent={updateNotificationContent}
          removeNotification={removeNotification}
        />
      )}

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

type ActionFollowNotificationProps = {
  notificationId: string;
  followerId: string;
  updateNotificationContent: (notificationId: string, newContent: string) => void;
  removeNotification: (notificationId: string) => void;
};

function ActionFollowNotification({
  notificationId,
  followerId,
  updateNotificationContent,
  removeNotification,
}: ActionFollowNotificationProps) {
  const { data: session } = useSession();
  const followingId = session?.user.id;
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Acceptation en cours...");

    const response = await post("follow/accept", {
      followerId,
      followingId,
      notificationId,
    });

    if (response.success) {
      toast.success("Demande de suivi acceptée.", { id: toastId });
      updateNotificationContent(notificationId, "vous suit");
    } else {
      toast.error(response.message, { id: toastId });
    }

    setIsLoading(false);
  };

  const handleDecline = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Refus en cours...");

    const response = await del(
      `follow/decline?followerId=${followerId}&followingId=${followingId}&notificationId=${notificationId}`
    );

    if (response.success) {
      toast.success("Demande de suivi refusée.", { id: toastId });
      removeNotification(notificationId);
    } else {
      toast.error(response.message, { id: toastId });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex gap-x-2 items-center">
      <TooltipComponent label="Accepter la demande">
        <Button onClick={handleAccept} isLoading={isLoading}>
          <Check className="size-4" />
        </Button>
      </TooltipComponent>
      <TooltipComponent label="Refuser la demande">
        <Button onClick={handleDecline} isLoading={isLoading}>
          <X className="size-4" />
        </Button>
      </TooltipComponent>
    </div>
  );
}

// =================================================================================================================================

const notificationLinkVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

// =================================================================================================================================
