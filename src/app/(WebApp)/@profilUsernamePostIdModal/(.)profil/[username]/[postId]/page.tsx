import ProfileUserModal from "@/components/ProfileUserModal";
import { get } from "@/utils/apiFn";

// ==================================================================================================================================

export default async function Page({ params }: { params: { username: string; postId: string } }) {
  const { postId } = params;

  const post = await get<PostWithCreatorByPostIdEndpointProps>(`posts/${postId}`, {
    tags: ["posts", `post-${postId}`],
    revalidateTime: 60,
  });

  const comments = await get<CommentsWithUsersByPostIdEndpointProps[]>(`posts/${postId}/comments`, {
    tags: ["comments", `post-${postId}-comments`],
    revalidateTime: 60,
  });

  const likes = await get<LikesWithUsersByPostIdEndpointProps[]>(`posts/${postId}/likes`, {
    tags: ["likes", `post-${postId}-likes`],
    revalidateTime: 60,
  });

  return (
    <ProfileUserModal
      post={post.data || ({} as PostWithCreatorByPostIdEndpointProps)}
      comments={comments.data || []}
      likes={likes.data || []}
    />
  );
}

// ==================================================================================================================================
