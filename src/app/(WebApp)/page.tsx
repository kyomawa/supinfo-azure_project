import PostContainer from "@/components/PostContainer";
import { homeMetadata } from "@/constants/metadata";
import { auth } from "@/lib/auth";
import { get } from "@/utils/apiFn";

export const metadata = homeMetadata;

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id;
  const posts = await get<PostEndpointProps[]>(`posts/followed/${userId}?take=10`, {
    tag: "posts",
    revalidateTime: 45,
  });

  return <PostContainer title="Votre actualité" initialPosts={posts.data || []} />;
}
