"use client";

import { get } from "@/utils/apiFn";
import { Loader } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import PostCard from "./PostCard";

// ==================================================================================================================================

type PostListProps = {
  initialPosts: PostEndpointProps[];
};

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<PostEndpointProps[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 10);
  const [skip, setSkip] = useState(initialPosts.length);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const updatePost = (updatedPost: PostEndpointProps) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  const removePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const result = await get<PostEndpointProps[]>(`/posts?skip=${skip}&take=10`, {
        tag: "posts",
        revalidateTime: 45,
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
    <ul className="flex flex-col gap-y-10 relative mb-[5.5rem]">
      {posts && posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isVideoMuted={isVideoMuted}
              setIsVideoMuted={setIsVideoMuted}
              onUpdate={updatePost}
              onDelete={removePost}
            />
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
