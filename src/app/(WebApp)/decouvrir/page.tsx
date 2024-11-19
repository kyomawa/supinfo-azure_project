import PostList from "@/components/PostList";
import { discoveryMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";

// ==================================================================================================================================

export const metadata = discoveryMetadata;

export default async function Page() {
  const posts = await get<PostEndpointProps[]>("posts?take=10", { tag: "posts", revalidateTime: 1800 });

  return (
    <div className="p-6 min-h-dvh 2xl:pr-36">
      <div className="specialPostContainer flex flex-col gap-y-6">
        <h1 className="title1 border-b border-black/5 pb-4 dark:border-white/10">Découvrir</h1>
        <PostList initialPosts={posts.data || []} />
      </div>
    </div>
  );
}
// ==================================================================================================================================
