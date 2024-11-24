"use client";

import Video from "../Video";
import Image from "@/components/Image";
import { Heart, MessageCircle, Send } from "lucide-react";
import UserIcon from "@/components/UserIcon";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PostCardEditForm from "./PostCardEditForm";
import PostCardDelete from "./PostCardDelete";
import PostCardSettings from "./PostCardSettings";

// ==================================================================================================================================

type PostCardProps = {
  post: PostEndpointProps;
  isVideoMuted: boolean;
  setIsVideoMuted: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: (updatedPost: PostEndpointProps) => void;
  onDelete: (postId: string) => void;
};

export default function PostCard({ post, isVideoMuted, setIsVideoMuted, onDelete, onUpdate }: PostCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
          <PostCardSettings setIsDeleteModalOpen={setIsDeleteModalOpen} setIsEditModalOpen={setIsEditModalOpen} />
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
          <span className="text-blue-500 dark:text-blue-300" key={tag}>
            #{tag}{" "}
          </span>
        ))}
      </p>
      {/* Modals  */}
      <PostCardEditForm
        description={description}
        tags={tags}
        postId={post.id}
        isOpen={isEditModalOpen}
        onUpdate={onUpdate}
        setIsOpen={setIsEditModalOpen}
      />
      <PostCardDelete
        postId={post.id}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onDelete={onDelete}
      />
    </li>
  );
}

// ==================================================================================================================================
