"use client";

import Image from "@/components/Image";
import UserIcon from "@/components/UserIcon";
import { get } from "@/utils/apiFn";
import { Ellipsis, Heart, Loader, MessageCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Video from "./Video";

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
            <PostCard key={post.id} post={post} isVideoMuted={isVideoMuted} setIsVideoMuted={setIsVideoMuted} />
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
  isVideoMuted: boolean;
  setIsVideoMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

function PostCard({ post, isVideoMuted, setIsVideoMuted }: PostCardProps) {
  const { description, mediaUrl, creator, likes, comments, tags } = post;
  const { id, username, image } = creator;
  const session = useSession();
  const userId = session.data?.user.id;
  const postOwnerIsCurrentUser = id === userId;
  const mediaIsAnImage = mediaUrl.includes("/images/");

  return (
    <li className="flex flex-col snap-center ">
      {/* User Info + Settings */}
      <div className="flex justify-between items-center max-md:p-3 py-2.5">
        <div className="flex items-center gap-x-2.5 ">
          {image ? (
            <Image
              src={image}
              alt={`Avatar de ${username}`}
              className="rounded-full"
              containerClassName="size-8 max-sm:aspect-square rounded-full"
              sizes="2rem"
              quality={100}
            />
          ) : (
            <UserIcon className="size-8 max-sm:aspect-square rounded-full" />
          )}
          <span className="text-sm font-medium">{username}</span>
        </div>
        {postOwnerIsCurrentUser && (
          <button>
            <Ellipsis className="size-6" />
          </button>
        )}
      </div>
      {/* Post Media */}
      {mediaIsAnImage ? (
        <Image
          src={mediaUrl}
          alt={`Média du créateur ${username}`}
          containerClassName="aspect-square size-full bg-white -z-[1] min-h-[62.5dvh] xs:min-h-[75dvh]"
          className="object-cover"
          sizes="100vw, (min-width: 1024px) 75vw, (min-width: 1536px) 35vw, (min-width: 1921px) 30vw"
          quality={100}
        />
      ) : (
        <Video
          isMuted={isVideoMuted}
          setIsMuted={setIsVideoMuted}
          src={mediaUrl}
          containerClassName="aspect-square size-full min-h-[62.5dvh] xs:min-h-[75dvh]"
          className="object-cover"
        />
      )}
      {/* Post Actions */}
      <div className="flex gap-x-4 py-2 mt-1 max-md:p-3">
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
      <p className="text-sm line-clamp-3 max-md:px-3">
        <span className="font-semibold">{username}</span> {description}{" "}
        {tags.map((tag) => (
          <span className="text-blue-300" key={tag}>
            #{tag}{" "}
          </span>
        ))}
      </p>
    </li>
  );
}

// ==================================================================================================================================
