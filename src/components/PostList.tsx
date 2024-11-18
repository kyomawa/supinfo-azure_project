"use client";

import Image from "@/components/Image";
import UserIcon from "@/components/UserIcon";
import { get } from "@/utils/apiFn";
import { Heart, Loader, MessageCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ==================================================================================================================================

type PostListProps = {
  initialPosts: PostEndpointProps[];
};

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<PostEndpointProps[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 10);
  const [skip, setSkip] = useState(initialPosts.length);

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const result = await get<PostEndpointProps[]>(`/post?skip=${skip}&take=10`, {
        tag: "posts",
        revalidateTime: 600,
      });

      if (result.success && result.data) {
        setPosts((prev) => [...prev, ...result.data]);
        setSkip((prev) => prev + result.data.length);
        if (result.data.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
    }
    setIsLoading(false);
  };

  return (
    <ul className="flex flex-col gap-y-6 relative">
      {posts && posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <motion.li
            key={posts.length}
            viewport={{ once: true, margin: "0px" }}
            onViewportEnter={loadMorePosts}
            className="w-full absolute left-0 right-0 bottom-0 h-1 -z-10"
          />
          <AnimatePresence>
            {isLoading && (
              <li className="py-2 justify-center flex">
                <Loader className="size-8 animate-loading" />
              </li>
            )}
          </AnimatePresence>
        </>
      ) : (
        <li className="py-2"> Aucun contenu à afficher...</li>
      )}
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
