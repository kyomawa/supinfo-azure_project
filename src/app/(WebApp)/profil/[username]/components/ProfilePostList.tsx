import Image from "@/components/Image";

// ==================================================================================================================================

type PostListProps = {
  posts: PostsByUserIdEndpointProps[];
  username: string;
};

export default function PostList({ posts, username }: PostListProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} username={username} />
      ))}
    </ul>
  );
}

// ==================================================================================================================================

type PostCardProps = {
  post: PostsByUserIdEndpointProps;
  username: string;
};

function PostCard({ post, username }: PostCardProps) {
  const { mediaUrl, videoThumbnail } = post;
  const isAnImage = mediaUrl.includes("/images/");

  return (
    <li>
      {isAnImage ? (
        <Image
          src={mediaUrl}
          alt={`Média du créateur ${username}`}
          containerClassName="aspect-square size-full bg-white -z-[1] "
          className="object-cover"
          sizes="100vw, (min-width: 1024px) 75vw, (min-width: 1536px) 35vw, (min-width: 1921px) 30vw"
          quality={100}
        />
      ) : (
        <Image
          src={videoThumbnail as string}
          alt={`Média du créateur ${username}`}
          containerClassName="aspect-square size-full bg-white -z-[1] "
          className="object-cover"
          sizes="100vw, (min-width: 1024px) 75vw, (min-width: 1536px) 35vw, (min-width: 1921px) 30vw"
          quality={100}
        />
      )}
    </li>
  );
}

// ==================================================================================================================================
