"use client";

import Image from "@/components/Image";
import Video from "@/components/Video";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ==================================================================================================================================

type ProfileUserModalProps = {
  post: PostWithCreatorByPostIdEndpointProps;
  comments: CommentsWithUsersByPostIdEndpointProps[];
  likes: LikesWithUsersByPostIdEndpointProps[];
};

export default function ProfileUserModal({ post, comments, likes }: ProfileUserModalProps) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed top-1/2 left-1/2 xl:h-[95dvh] z-50 size-full xl:w-[60rem] 2xl:w-[75rem] 2k:w-[90rem] -translate-x-1/2 -translate-y-1/2">
        <PostCard post={post} comments={comments} likes={likes} />
      </div>
      <Overlay router={router} />
    </AnimatePresence>
  );
}

// ==================================================================================================================================

type PostCardProps = {
  post: PostWithCreatorByPostIdEndpointProps;
  comments: CommentsWithUsersByPostIdEndpointProps[];
  likes: LikesWithUsersByPostIdEndpointProps[];
};

function PostCard({ post }: PostCardProps) {
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const { mediaUrl, creator } = post;
  const mediaIsAnImage = mediaUrl.includes("/images/");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      className="size-full bg-neutral-50 dark:bg-neutral-950 flex"
    >
      {mediaIsAnImage ? (
        <Image
          src={mediaUrl}
          alt={`Média du créateur ${creator.username}`}
          containerClassName="aspect-square w-[67.5%]"
          className="object-cover"
          sizes="100vw, (min-width: 1024px) 75vw, (min-width: 1536px) 35vw, (min-width: 1921px) 30vw"
          quality={100}
        />
      ) : (
        <Video
          isMuted={isVideoMuted}
          setIsMuted={setIsVideoMuted}
          src={mediaUrl}
          containerClassName="aspect-square w-[67.5%]"
          className="object-cover"
        />
      )}
      <div className=""></div>
    </motion.div>
  );
}

// ==================================================================================================================================

type OverlayProps = {
  router: AppRouterInstance;
};

function Overlay({ router }: OverlayProps) {
  return (
    <motion.div
      onClick={() => router.back()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/50 flex items-start justify-end p-6"
    >
      <button onClick={() => router.back()}>
        <X className="size-8 text-white/85 hover:text-white duration-200 transition-colors" />
      </button>
    </motion.div>
  );
}

// ==================================================================================================================================
