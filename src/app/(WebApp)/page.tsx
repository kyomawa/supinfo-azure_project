import PostContainer from "@/components/Post/PostContainer";
import { homeMetadata } from "@/constants/metadata";
import { auth } from "@/lib/auth";
import { get } from "@/utils/apiFn";

export const metadata = homeMetadata;

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id;
  const posts = await get<PostEndpointProps[]>(`posts/followed/${userId}?take=10`, {
    tags: ["posts", "likes", "comments"],
    revalidateTime: 45,
  });

  return <PostContainer initialPosts={posts.data || []} urlToFetch={`posts/followed/${userId}?take=10`} />;
}
