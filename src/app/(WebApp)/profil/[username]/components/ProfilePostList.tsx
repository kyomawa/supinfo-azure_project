"use client";

import { useState } from "react";
import ProfilePostCard from "./ProfilePostCard";
import { get } from "@/utils/apiFn";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==================================================================================================================================

type PostListProps = {
  posts: PostsByUserIdEndpointProps[];
  username: string;
  userId: string;
};

export default function PostList({ posts: initialPosts, username, userId }: PostListProps) {
  const [posts, setPosts] = useState<PostsByUserIdEndpointProps[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 9);
  const [skip, setSkip] = useState(initialPosts.length);

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const res = await get<PostsByUserIdEndpointProps[]>(`users/${userId}/posts?take=9&skip=${skip}`, {
      tags: ["posts", `user-${userId}-posts`],
      revalidateTime: 45,
    });

    if (res.success && res.data) {
      setPosts((prev) => [...prev, ...res.data]);
      setSkip((prev) => prev + res.data.length);
      if (res.data.length < 9) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 relative">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <ProfilePostCard key={post.id} post={post} username={username} />
            ))}
            <motion.li
              key={posts.length}
              viewport={{ once: true, margin: "0px" }}
              onViewportEnter={loadMorePosts}
              className="w-full absolute left-0 right-0 bottom-0 h-1 -z-10"
            />
          </>
        ) : (
          <li className="py-2 text-center">Aucun contenu à afficher...</li>
        )}
      </ul>
      <AnimatePresence>
        {isLoading && (
          <div className="py-2 justify-center flex">
            <Loader className="size-8 animate-loading" />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==================================================================================================================================
