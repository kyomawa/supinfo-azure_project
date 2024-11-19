import PostList from "@/components/PostList";
import { homeMetadata } from "@/constants/metadata";
import { auth } from "@/lib/auth";
import { get } from "@/utils/apiFn";

export const metadata = homeMetadata;

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id;
  const posts = await get<PostEndpointProps[]>(`posts/followed/${userId}?take=10`, {
    tag: "posts",
    revalidateTime: 1800,
  });

  return (
    <div className="p-6 min-h-dvh 2xl:pr-36">
      <div className="specialPostContainer flex flex-col gap-y-6">
        <h1 className="title1 border-b border-black/5 pb-4 dark:border-white/10">Votre actualité</h1>
        <PostList initialPosts={posts.data || []} />
      </div>
    </div>
  );
}
