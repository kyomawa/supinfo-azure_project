import ProfilePostCard from "./ProfilePostCard";

// ==================================================================================================================================

type PostListProps = {
  posts: PostsByUserIdEndpointProps[];
  username: string;
};

export default function PostList({ posts, username }: PostListProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {posts.map((post) => (
        <ProfilePostCard key={post.id} post={post} username={username} />
      ))}
    </ul>
  );
}

// ==================================================================================================================================
