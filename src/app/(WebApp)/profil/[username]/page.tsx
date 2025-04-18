import { profileMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";
import { User } from "@prisma/client";
import Profile from "./components/Profile";
import { auth } from "@/lib/auth";

export const metadata = profileMetadata;

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;

  const session = await auth();
  const userConnectedId = session?.user?.id;

  const res = await get<User>(`users/${username}`, { tags: ["users", `user-${username}`], revalidateTime: 180 });
  const user = res.data;

  const userPostCount = await get<string>(`users/${user?.id}/postCount`, {
    tags: ["posts", `user-${user?.id}-post-count`],
    revalidateTime: 45,
  });

  const posts = await get<PostsByUserIdEndpointProps[]>(`users/${user?.id}/posts?take=9`, {
    tags: ["posts", `user-${user?.id}-posts`],
    revalidateTime: 45,
  });
  const followers = await get<FollowerByUserIdEndpointProps[]>(`users/${user?.id}/followers`, {
    tags: ["follows", `user-${user?.id}-followers`],
    revalidateTime: 45,
  });
  const followings = await get<FollowerByUserIdEndpointProps[]>(`users/${user?.id}/followings`, {
    tags: ["follows", `user-${user?.id}-followings`],
    revalidateTime: 45,
  });

  let isFollowing = false;

  if (followers.data) {
    followers.data.map((follower) => {
      if (follower.id === userConnectedId) {
        isFollowing = true;
      }
    });
  }

  const mustHideFollows =
    !isFollowing && (user?.visibility === "PRIVATE" || user?.visibility === "FRIENDS") && user?.id !== userConnectedId;

  return (
    <div className="md:p-6 pageHeight 2xl:pr-36">
      <div className="specialProfileContainer">
        <div className="p-6">
          {user ? (
            <Profile
              user={user}
              mustHideFollows={mustHideFollows}
              userPostCount={userPostCount.data || "0"}
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
