"use client";

import { useState } from "react";
import NotificationItem from "./NotificationItem";
import { get } from "@/utils/apiFn";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==================================================================================================================================

type NotificationListProps = {
  initialNotifications: NotificationByUserIdEndpointProps[];
  userId: string;
};

export default function NotificationList({ initialNotifications, userId }: NotificationListProps) {
  const [notifications, setNotifications] = useState<NotificationByUserIdEndpointProps[]>(initialNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialNotifications.length === 20);
  const [skip, setSkip] = useState(initialNotifications.length);

  const loadMoreNotifications = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const res = await get<NotificationByUserIdEndpointProps[]>(`users/${userId}/notifications?take=20&skip=${skip}`, {
      tags: ["notifications", "likes", "comments", "posts", "follows"],
      revalidateTime: 45,
    });

    if (res.success && res.data) {
      setNotifications((prev) => [...prev, ...res.data]);
      setSkip((prev) => prev + res.data.length);
      if (res.data.length < 20) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  const updateNotificationContent = (notificationId: string, newContent: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, content: newContent } : notification
      )
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <>
      <ul className="flex flex-col gap-y-4 relative mb-6">
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                updateNotificationContent={updateNotificationContent}
                removeNotification={removeNotification}
              />
            ))}
            <motion.li
              key={notifications.length}
              viewport={{ once: true, margin: "0px" }}
              onViewportEnter={loadMoreNotifications}
              className="w-full absolute left-0 right-0 bottom-0 h-1 -z-10"
            />
          </>
        ) : (
          <li className="py-2 text-center">Aucune notification à afficher...</li>
        )}
      </ul>
      <AnimatePresence>
        {isLoading && (
          <div className="py-2 justify-center flex">
            <Loader className="size-8 animate-loading" />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==================================================================================================================================
