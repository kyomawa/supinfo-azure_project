import PostContainer from "@/components/PostContainer";
import { discoveryMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";

// ==================================================================================================================================

export const metadata = discoveryMetadata;

export default async function Page() {
  const posts = await get<PostEndpointProps[]>("posts?take=10", { tag: "posts", revalidateTime: 45 });

  return <PostContainer title="Découvrir" initialPosts={posts.data || []} />;
}
// ==================================================================================================================================
