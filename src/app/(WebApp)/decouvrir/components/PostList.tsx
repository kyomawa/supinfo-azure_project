// ==================================================================================================================================

import Image from "@/components/Image";
import UserIcon from "@/components/UserIcon";
import { Heart, MessageCircle, Send } from "lucide-react";

type PostListProps = {
  posts: PostEndpointProps[];
};

export default function PostList({ posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
}

// ==================================================================================================================================

type PostCardProps = {
  post: PostEndpointProps;
};

function PostCard({ post }: PostCardProps) {
  const { description, mediaUrl, creator, likes, comments } = post;
  const { username, image } = creator;

  return (
    <li className="flex flex-col">
      {/* User Info */}
      <div className="flex items-center gap-x-2.5 py-2.5">
        {image ? (
          <Image
            src={image}
            alt={`Avatar de ${username}`}
            className="rounded-full"
            containerClassName="size-8 max-sm:aspect-square rounded-full"
            sizes="1.5rem"
            quality={100}
          />
        ) : (
          <UserIcon className="size-8 max-sm:aspect-square rounded-full" />
        )}
        <span className="text-sm font-medium">{username}</span>
      </div>
      {/* Post Media */}
      <Image
        src={mediaUrl}
        alt={`Média du créateur ${username}`}
        containerClassName="aspect-square size-full -z-[1]"
        sizes="100vw, (min-width: 1280px) 50vw"
      />
      {/* Post Actions */}
      <div className="flex gap-x-4 py-2.5">
        {/* Likes Actions + Number  */}
        <div className="flex items-center gap-x-1">
          <Heart className="size-6" />
          <span className="text-sm font-semibold">{likes.length}</span>
        </div>
        {/* Message Actions + Number */}
        <div className="flex items-center gap-x-1">
          <MessageCircle className="size-6" />
          <span className="text-sm font-semibold">{comments.length}</span>
        </div>
        <Send className="size-6" />
      </div>
      {/* Post Footer */}
      <p className="text-sm line-clamp-3">
        <span className="font-semibold">{username}</span> {description}
      </p>
    </li>
  );
}

// ==================================================================================================================================
