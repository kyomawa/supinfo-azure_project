"use client";

import FormTextAreaField from "@/components/FormFields/FormTextAreaField";
import Image from "@/components/Image";
import PostCardDelete from "@/components/Post/PostCardDelete";
import PostCardEditForm from "@/components/Post/PostCardEditForm";
import PostCardSettings from "@/components/Post/PostCardSettings";
import TooltipComponent from "@/components/TooltipComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import UserIcon from "@/components/UserIcon";
import Video from "@/components/Video";
import { schemaNewCommentForm } from "@/constants/schema";
import { cn, formatFullTimeAgo } from "@/lib/utils";
import { del, post } from "@/utils/apiFn";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Heart, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

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

function PostCard({ post, likes: initialLikes, comments }: PostCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const { mediaUrl, creator, tags, description, createdAt } = post;
  const mediaIsAnImage = mediaUrl.includes("/images/");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      className="size-full bg-neutral-50 dark:bg-neutral-950 flex"
    >
      {/* Media */}
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
      {/* Creator + Comments + (Likes Share Number of Likes and createdDate) + Add comment */}
      <div className="flex flex-col gap-y-3 w-full">
        <CreatorSection
          creator={creator}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
        />
        <CommentList comments={comments} />
        <ActionButtons
          likes={likes}
          setLikes={setLikes}
          postDate={createdAt}
          username={creator.username}
          postId={post.id}
        />
        <NewComment postId={post.id} />
      </div>
      {/* Modals  */}
      <PostCardEditForm
        description={description}
        tags={tags}
        postId={post.id}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
      />
      <PostCardDelete postId={post.id} isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} />
    </motion.div>
  );
}

// ==================================================================================================================================

type CommentListProps = {
  comments: CommentsWithUsersByPostIdEndpointProps[];
};

function CommentList({ comments }: CommentListProps) {
  return (
    <ul className="flex flex-col flex-1 overflow-y-auto scrollbarVertical">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}

// ==================================================================================================================================

type CommentCardProps = {
  comment: CommentsWithUsersByPostIdEndpointProps;
};

function CommentCard({ comment }: CommentCardProps) {
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const { content, createdAt, user } = comment;
  const { username, image } = user;
  const isUserConnectedTheCommentator = userConnectedId === user.id;

  return (
    <li className="flex gap-x-3 p-3 w-full">
      <Link href={`/profil/${username}`}>
        {image ? (
          <Image
            src={image}
            alt={`Image de ${username}`}
            containerClassName="size-10 rounded-full"
            className="rounded-full"
            sizes="2.5rem"
          />
        ) : (
          <UserIcon className="size-10 rounded-full" />
        )}
      </Link>
      <div className="flex flex-col gap-y-0.5 flex-1">
        <p className="text-sm line-clamp-6">
          <Link className="font-medium" href={`/profil/${username}`}>
            {username}
          </Link>{" "}
          {content}
        </p>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{formatFullTimeAgo(createdAt)}</span>
      </div>
      {isUserConnectedTheCommentator && <CommentCardSettings />}
    </li>
  );
}

// ==================================================================================================================================

function CommentCardSettings() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Edition</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Modifier</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ==================================================================================================================================

type NewCommentProps = {
  postId: string;
};

function NewComment({ postId }: NewCommentProps) {
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof schemaNewCommentForm>>({
    resolver: zodResolver(schemaNewCommentForm),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaNewCommentForm>) => {
    const toastId = toast.loading("Ajout d'un commentaire en cours...");
    setIsLoading(true);

    const newComment = await post<CommentsWithUsersByPostIdEndpointProps>("comments", {
      postId,
      userId: userConnectedId,
      content: values.content,
    });

    if (!newComment.success) {
      toast.error(newComment.message);
      return;
    }

    toast.success(newComment.message, { id: toastId });
    form.reset();
  };

  return (
    <div className="p-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between items-start gap-x-3">
          <div className="flex-1 ">
            <FormTextAreaField
              name="content"
              form={form}
              placeholder="Ajouter un commentaire..."
              className="min-h-0 bg-neutral-50 dark:bg-neutral-950 border-none focus-visible:ring-transparent focus-visible:ring-offset-transparent p-0"
            />
          </div>
          <Button
            variant="text"
            className="py-0 px-3 mt-0.5 h-fit hover:opacity-85"
            type="submit"
            isLoading={isLoading}
          >
            Publier
          </Button>
        </form>
      </Form>
    </div>
  );
}

// ==================================================================================================================================

type ActionButtonsProps = {
  likes: LikesWithUsersByPostIdEndpointProps[];
  setLikes: React.Dispatch<React.SetStateAction<LikesWithUsersByPostIdEndpointProps[]>>;
  postDate: Date;
  username: string;
  postId: string;
};

function ActionButtons({ likes, setLikes, postDate, username, postId }: ActionButtonsProps) {
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const linkToPost = `${location.origin}/profil/${username}/${postId}`;
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
    <div className="border-y border-neutral-150 dark:border-white/10 flex flex-col gap-y-1.5 p-3">
      <div className="flex gap-x-3 py-2">
        {/* Likes Actions + Number  */}
        <TooltipComponent label="Aimer la publication">
          <button onClick={toggleLikePost} className="flex items-center gap-x-1">
            <Heart className={cn("size-6", userConnectedHaveLikedPost && "text-red-500 fill-red-500")} />
          </button>
        </TooltipComponent>
        <TooltipComponent label="Copier le lien vers la publication">
          <button onClick={copyToClipboard}>
            <Send className="size-6" />
          </button>
        </TooltipComponent>
      </div>
      <span className="text-sm font-semibold">{likes.length} j&apos;aime</span>
      <span className="text-xs text-neutral-500 dark:text-white/40">{formatFullTimeAgo(postDate)}</span>
    </div>
  );
}

// ==================================================================================================================================

type CreatorSectionProps = {
  creator: User;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreatorSection({ creator, setIsDeleteModalOpen, setIsEditModalOpen }: CreatorSectionProps) {
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const isPostAuthor = userConnectedId === creator.id;
  const { username, image } = creator;

  return (
    <div className="p-3 flex justify-between items-center w-full border-b border-neutral-150 dark:border-white/10">
      {/* Image + Username */}
      <Link href={`/profil/${creator.username}`} className="flex items-center gap-x-2">
        {image ? (
          <Image
            src={image}
            alt={`Image de ${creator.username}`}
            containerClassName="size-10 rounded-full"
            className="rounded-full"
            sizes="2.5rem"
          />
        ) : (
          <UserIcon className="size-10 rounded-full" />
        )}
        <span className="font-medium text-sm">{username}</span>
      </Link>
      {/* Three dots */}
      {isPostAuthor && (
        <PostCardSettings
          className="size-4"
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}
    </div>
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
