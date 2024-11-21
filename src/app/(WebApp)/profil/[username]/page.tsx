import { profileMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import Profile from "./components/Profile";

export const metadata = profileMetadata;

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;

  const res = await get<User>(`users/${username}`, { tag: `user-${username}`, revalidateTime: 180 });
  const user = res.data;

  return (
    <div className="md:p-6 pageHeight 2xl:pr-36">
      <div className="specialPostContainer">
        <div className="p-6">{user ? <Profile user={user} /> : <div>Ce Profile n&apos;existe pas</div>}</div>
      </div>
    </div>
  );
}
