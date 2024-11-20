import PostList from "@/components/PostList";
import { discoveryMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";

// ==================================================================================================================================

export const metadata = discoveryMetadata;

export default async function Page() {
  const posts = await get<PostEndpointProps[]>("posts?take=10", { tag: "posts", revalidateTime: 1800 });

  return (
    <div className="p-6 h-dvh 2xl:pr-36 scroll-smooth snap-y snap-mandatory overscroll-y-contain scrollbarVertical overflow-y-auto">
      <div className="specialPostContainer flex flex-col gap-y-10">
        <h1 className="title1 border-b border-black/5 pb-4 dark:border-white/10">Découvrir</h1>
        <PostList initialPosts={posts.data || []} />
      </div>
    </div>
  );
}
// ==================================================================================================================================
