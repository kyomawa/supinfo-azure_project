import PostList from "@/components/PostList";
import { discoveryMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";

// ==================================================================================================================================

export const metadata = discoveryMetadata;

export default async function Page() {
  const posts = await get<PostEndpointProps[]>("post?take=10", { tag: "posts", revalidateTime: 600 });

  return (
    <div className="p-6 min-h-dvh md:mr-[4.75rem] xl:mr-64">
      <div className="specialPostContainer flex flex-col gap-y-6">
        <h1 className="title1 border-b border-black/5 pb-4 dark:border-white/10">Découvrir</h1>
        <PostList initialPosts={posts.data || []} />
      </div>
    </div>
  );
}
// ==================================================================================================================================
