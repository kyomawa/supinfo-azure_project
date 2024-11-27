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
import { User } from "@prisma/client";
import { del, post } from "@/utils/apiFn";
import TooltipComponent from "../TooltipComponent";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

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
  const { description, mediaUrl, creator, comments, tags } = post;
  const initialLikes = post.likes as unknown as LikesWithUsersByPostIdEndpointProps[];
  const { id, username, image } = creator;
  const [likes, setLikes] = useState(initialLikes);
  const session = useSession();
  const userId = session.data?.user.id;
  const postOwnerIsCurrentUser = id === userId;
  const mediaIsAnImage = mediaUrl.includes("/images/");

  return (
    <li className="flex flex-col snap-center ">
      {/* User Info + Settings */}
      <div className="flex justify-between items-center max-md:p-3 py-2.5">
        <Link href={`/profil/${username}`} className="flex items-center gap-x-2.5 ">
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
        </Link>
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
      <ActionButtons
        likes={likes as unknown as LikesWithUsersByPostIdEndpointProps[]}
        comments={comments as unknown as CommentsWithUsersByPostIdEndpointProps[]}
        creator={creator}
        postId={post.id}
        setLikes={setLikes}
      />
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

type ActionButtonsProps = {
  postId: string;
  likes: LikesWithUsersByPostIdEndpointProps[];
  setLikes: React.Dispatch<React.SetStateAction<LikesWithUsersByPostIdEndpointProps[]>>;
  comments: CommentsWithUsersByPostIdEndpointProps[];
  creator: User;
};

function ActionButtons({ likes, comments, creator, postId, setLikes }: ActionButtonsProps) {
  const { username } = creator;
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const linkToPost = typeof window !== "undefined" ? `${window.location.origin}/profil/${username}/${postId}` : "";

  const userConnectedHaveLikedPost = likes.some((like) => like.user.id === userConnectedId);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkToPost);
  };

  const toggleLikePost = async () => {
    if (userConnectedHaveLikedPost) {
      const userConnectedLike = likes.find((like) => like.user.id === userConnectedId);
      if (userConnectedLike) {
        await del(`likes/${userConnectedLike.id}`);
        setLikes((prevLikes) => prevLikes.filter((like) => like.id !== userConnectedLike.id));
      }
    } else {
      const newLike = await post<LikesWithUsersByPostIdEndpointProps>("likes", { userId: userConnectedId, postId });
      if (newLike.success && newLike.data) {
        setLikes((prevLikes) => [...prevLikes, { ...newLike.data, user: newLike.data.user }]);
      }
    }
  };

  return (
    <div className="flex gap-x-4 py-2 mt-1 max-md:p-3">
      {/* Likes Actions + Number  */}
      <TooltipComponent label="Aimer la publication">
        <button onClick={toggleLikePost} className="flex items-center gap-x-1">
          <Heart className={cn("size-6", userConnectedHaveLikedPost && "text-red-500 fill-red-500")} />
          <span className="text-sm font-semibold">{likes.length}</span>
        </button>
      </TooltipComponent>
      {/* Message Actions + Number */}
      <TooltipComponent label="Ajouter un commentaire">
        <Link href={linkToPost} className="flex items-center gap-x-1">
          <MessageCircle className="size-6" />
          <span className="text-sm font-semibold">{comments.length}</span>
        </Link>
      </TooltipComponent>
      <TooltipComponent label="Copier le lien vers la publication">
        <button onClick={copyToClipboard}>
          <Send className="size-6" />
        </button>
      </TooltipComponent>
    </div>
  );
}

// ==================================================================================================================================
