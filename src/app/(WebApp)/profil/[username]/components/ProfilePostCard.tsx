"use client";

import { motion } from "motion/react";
import Image from "@/components/Image";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { redirectHard } from "@/lib/utilsServer";

// ==================================================================================================================================

type PostCardProps = {
  post: PostsByUserIdEndpointProps;
  username: string;
};

export default function ProfilePostCard({ post, username }: PostCardProps) {
  const { mediaUrl, videoThumbnail, comments, likes } = post;
  const isAnImage = mediaUrl.includes("/images/");

  return (
    <motion.li whileHover="hover" className="relative cursor-pointer">
      <LinkType href={`/profil/${username}/${post.id}`}>
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
        <motion.div
          className="absolute inset-0 bg-black/50 flex gap-x-8 items-center justify-center"
          initial={{ opacity: 0 }}
          transition={{
            duration: 0.325,
            type: "spring",
            stiffness: 175,
            damping: 20,
          }}
          variants={cardVariant}
        >
          <div className="flex gap-x-2">
            <Heart className="size-6 fill-white text-white" />
            <span className="text-sm font-semibold">{likes.length}</span>
          </div>
          <div className="flex gap-x-2">
            <MessageCircle className="size-6 fill-white text-white" />
            <span className="text-sm font-semibold">{comments.length}</span>
          </div>
        </motion.div>
      </LinkType>
    </motion.li>
  );
}

// ==================================================================================================================================

type LinkTypeProps = {
  children: React.ReactNode;
  href: string;
};

function LinkType({ children, href }: LinkTypeProps) {
  const isDesktop = useMediaQuery("(min-width: 780px)");

  if (!isDesktop) {
    return <div onClick={() => redirectHard(href)}>{children}</div>;
  }

  return (
    <Link href={href} scroll={false}>
      {children}
    </Link>
  );
}

// ==================================================================================================================================

const cardVariant = {
  hover: { opacity: 1 },
};

// ==================================================================================================================================
