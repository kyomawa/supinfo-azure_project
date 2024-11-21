// ==================================================================================================================================

import NotificationItem from "./NotificationItem";

type NotificationListProps = {
  notifications: NotificationByUserIdEndpointProps[];
};

export default function NotificationList({ notifications }: NotificationListProps) {
  return (
    <ul>
      {notifications ? (
        notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />)
      ) : (
        <li>Aucune notification</li>
      )}
    </ul>
  );
}

// ==================================================================================================================================
