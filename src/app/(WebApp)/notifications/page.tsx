import { notificationsMetadata } from "@/constants/metadata";
import NotificationList from "./components/NotificationList";
import { auth } from "@/lib/auth";
import { get } from "@/utils/apiFn";

export const metadata = notificationsMetadata;

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id;

  const response = await get<NotificationByUserIdEndpointProps[]>(`users/${userId}/notifications`, {
    tag: `notification-${userId}`,
    revalidateTime: 60,
  });

  return (
    <div className="md:p-6 pageHeight 2xl:pr-36">
      <section className="specialPostContainer flex flex-col gap-y-6">
        <h1 className="title1 border-b border-black/5 pb-4 dark:border-white/10 max-md:p-6">Notifications</h1>
        <NotificationList notifications={response.data || []} />
      </section>
    </div>
  );
}
