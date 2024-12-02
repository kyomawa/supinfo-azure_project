"use client";

import { useState } from "react";
import ProfilePostCard from "./ProfilePostCard";
import { get } from "@/utils/apiFn";
import { Loader, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "@prisma/client";

// ==================================================================================================================================

type ProfilePostListProps = {
  posts: PostsByUserIdEndpointProps[];
  user: User;
  userConnectedOwnTheProfil: boolean;
  userConnectedIsSuscribed: boolean;
};

export default function ProfilePostList({
  posts: initialPosts,
  user,
  userConnectedIsSuscribed,
  userConnectedOwnTheProfil,
}: ProfilePostListProps) {
  const [posts, setPosts] = useState<PostsByUserIdEndpointProps[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 9);
  const [skip, setSkip] = useState(initialPosts.length);

  const { username, id: userId, visibility } = user;
  const profileIsHidden = visibility === "PRIVATE" && !userConnectedIsSuscribed && !userConnectedOwnTheProfil;

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

  return profileIsHidden ? (
    <PrivateProfileCard />
  ) : (
    <CardList posts={posts} username={username} userId={userId} loadMorePosts={loadMorePosts} isLoading={isLoading} />
  );
}

// ==================================================================================================================================

type CardListProps = {
  posts: PostsByUserIdEndpointProps[];
  username: string;
  userId: string;
  loadMorePosts: () => Promise<void>;
  isLoading: boolean;
};

function CardList({ posts, username, loadMorePosts, isLoading }: CardListProps) {
  return (
    <>
      {posts.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 relative">
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
        </ul>
      ) : (
        <p className="py-2 text-center text-lg">Cet utilisateur n&apos;a pas encore publié de publication.</p>
      )}
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

function PrivateProfileCard() {
  return (
    <div className="flex gap-x-2 items-center justify-center">
      <div className="p-3 border rounded-full border-neutral-200 dark:border-white/20">
        <Lock className="size-7 stroke-1 " />
      </div>
      <div className="flex flex-col">
        <p className="font-medium">Ce compte est privé</p>
        <p className="text-neutral-500 dark:text-white/40">
          Vous devez être abonné pour voir les publications de ce profil.
        </p>
      </div>
    </div>
  );
}
