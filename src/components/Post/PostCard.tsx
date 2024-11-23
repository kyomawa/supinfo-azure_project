"use client";

import Video from "../Video";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "@/components/Image";
import { Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import UserIcon from "@/components/UserIcon";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { del } from "@/utils/apiFn";
import PostCardEditForm from "./PostCardEditForm";

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
          <Settings setIsDeleteModalOpen={setIsDeleteModalOpen} setIsEditModalOpen={setIsEditModalOpen} />
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

type SettingsProps = {
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Settings({ setIsDeleteModalOpen, setIsEditModalOpen }: SettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setIsDeleteModalOpen(true)}>
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ====================================================================================================================================

type PostCardDeleteProps = {
  postId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (postId: string) => void;
};

function PostCardDelete({ isOpen, setIsOpen, postId, onDelete }: PostCardDeleteProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const toastId = toast.loading("Suppression de la publication en cours...");
    setIsLoading(true);

    const res = await del(`posts/${postId}`);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Publication supprimée avec succès.", { id: toastId });
    onDelete(postId);
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression de la publication</AlertDialogTitle>
          <AlertDialogDescription>
            Attention, vous êtes sur le point de supprimer cette publication. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button isLoading={isLoading} onClick={handleClick}>
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ====================================================================================================================================
