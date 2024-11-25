import PostContainer from "@/components/Post/PostContainer";
import { discoveryMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";

// ==================================================================================================================================

export const metadata = discoveryMetadata;

export default async function Page() {
  const posts = await get<PostEndpointProps[]>("posts?take=10", {
    tags: ["posts", "likes", "comments"],
    revalidateTime: 45,
  });

  return <PostContainer initialPosts={posts.data || []} urlToFetch="posts?take=10" />;
}
// ==================================================================================================================================
