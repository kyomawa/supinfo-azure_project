import { profileMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import Profile from "./components/Profile";

export const metadata = profileMetadata;

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;

  const res = await get<User>(`users/${username}`, { tags: ["users", `user-${username}`], revalidateTime: 180 });
  const user = res.data;

  const posts = await get<PostsByUserIdEndpointProps[]>(`users/${user?.id}/posts`, {
    tags: ["posts", `user-${user?.id}-posts`],
    revalidateTime: 45,
  });
  const followers = await get<User[]>(`users/${user?.id}/followers`, {
    tags: ["follows", `user-${user?.id}-followers`],
    revalidateTime: 45,
  });
  const followings = await get<User[]>(`users/${user?.id}/followings`, {
    tags: ["follows", `user-${user?.id}-followings`],
    revalidateTime: 45,
  });

  return (
    <div className="md:p-6 pageHeight 2xl:pr-36">
      <div className="specialProfileContainer">
        <div className="p-6">
          {user ? (
            <Profile
              user={user}
              posts={posts.data || []}
              followers={followers.data || []}
              followings={followings.data || []}
            />
          ) : (
            <div>Ce Profile n&apos;existe pas</div>
          )}
        </div>
      </div>
    </div>
  );
}
