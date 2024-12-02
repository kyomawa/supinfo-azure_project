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
import { del, patch, post } from "@/utils/apiFn";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Ellipsis } from "lucide-react";

// ==================================================================================================================================

type ProfileUserModalProps = {
  isInAModal?: boolean;
  post: PostWithCreatorByPostIdEndpointProps;
  comments: CommentsWithUsersByPostIdEndpointProps[];
  likes: LikesWithUsersByPostIdEndpointProps[];
};

export default function ProfileUserModal({ post, comments, likes, isInAModal }: ProfileUserModalProps) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (isInAModal) {
    return (
      <AnimatePresence>
        <div className="fixed top-1/2 left-1/2 xl:h-[95dvh] z-50 size-full xl:w-[60rem] 2xl:w-[75rem] 2k:w-[90rem] -translate-x-1/2 -translate-y-1/2">
          <PostCard post={post} comments={comments} likes={likes} isInAModal />
        </div>
        <Overlay router={router} />
      </AnimatePresence>
    );
  }

  return (
    <div className="h-[95dvh] size-full w-[65vw] 2k:w-[70vw] mx-auto">
      <PostCard post={post} comments={comments} likes={likes} isInAModal={false} />
    </div>
  );
}

// ==================================================================================================================================

type PostCardProps = {
  post: PostWithCreatorByPostIdEndpointProps;
  comments: CommentsWithUsersByPostIdEndpointProps[];
  likes: LikesWithUsersByPostIdEndpointProps[];
  isInAModal?: boolean;
};

function PostCard({ post, likes: initialLikes, comments: initialComments, isInAModal }: PostCardProps) {
  const [comments, setComments] = useState(initialComments);
  const [likes, setLikes] = useState(initialLikes);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const { mediaUrl, creator, tags, description, createdAt } = post;
  const mediaIsAnImage = mediaUrl.includes("/images/");

  useEffect(() => {
    if (!isInAModal) {
      setIsVideoMuted(true);
    }
  }, [isInAModal]);

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
        <CommentList comments={comments} creatorId={creator.id} setComments={setComments} />
        <ActionButtons
          likes={likes}
          setLikes={setLikes}
          postDate={createdAt}
          username={creator.username}
          postId={post.id}
        />
        <NewComment postId={post.id} setComments={setComments} />
      </div>
      {/* Modals  */}
      <PostCardEditForm
        description={description}
        tags={tags}
        postId={post.id}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
      />
      <PostCardDelete
        postId={post.id}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        mustNavigateBack={true}
      />
    </motion.div>
  );
}

// ==================================================================================================================================

type CommentListProps = {
  creatorId: string;
  comments: CommentsWithUsersByPostIdEndpointProps[];
  setComments: React.Dispatch<React.SetStateAction<CommentsWithUsersByPostIdEndpointProps[]>>;
};

function CommentList({ comments, creatorId, setComments }: CommentListProps) {
  return (
    <ul className="flex flex-col flex-1 overflow-y-auto scrollbarVertical">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} creatorId={creatorId} setComments={setComments} />
      ))}
    </ul>
  );
}

// ==================================================================================================================================

type CommentCardProps = {
  creatorId: string;
  comment: CommentsWithUsersByPostIdEndpointProps;
  setComments: React.Dispatch<React.SetStateAction<CommentsWithUsersByPostIdEndpointProps[]>>;
};

function CommentCard({ comment, creatorId, setComments }: CommentCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const { content, createdAt, user } = comment;
  const { username, image } = user;
  const isUserConnectedTheCommentator = userConnectedId === user.id;
  const isUserConnectedThePostAuthor = userConnectedId === creatorId && !isUserConnectedTheCommentator;

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
      {isUserConnectedTheCommentator && (
        <CommentCardSettings setIsEditModalOpen={setIsEditModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} />
      )}
      {isUserConnectedThePostAuthor && <CommentCardDelete comment={comment} setComments={setComments} />}
      {/* Modals  */}
      <CommentCardSettingsEditForm
        comment={comment}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        setComments={setComments}
      />
      <CommentCardSettingsDeleteForm
        comment={comment}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        setComments={setComments}
      />
    </li>
  );
}

// ==================================================================================================================================

type CommentCardDeleteProps = {
  comment: CommentsWithUsersByPostIdEndpointProps;
  setComments: React.Dispatch<React.SetStateAction<CommentsWithUsersByPostIdEndpointProps[]>>;
};

function CommentCardDelete({ comment, setComments }: CommentCardDeleteProps) {
  const { content, user } = comment;
  const { username } = user;

  const handleClick = async () => {
    const toastId = toast.loading("Suppression du commentaire en cours...");
    const response = await del(`comments/${comment.id}`);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setComments((prevComments) => prevComments.filter((c) => c.id !== comment.id));

    toast.success("Commentaire supprimé avec succès.", { id: toastId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <TooltipComponent label="Supprimer le commentaire">
          <X className="size-4" />
        </TooltipComponent>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression du commentaire de {username}</AlertDialogTitle>
          <AlertDialogDescription>Vous supprimerez le commentaire suivant : {content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ==================================================================================================================================

type CommentCardSettingsProps = {
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CommentCardSettings({ setIsEditModalOpen, setIsDeleteModalOpen }: CommentCardSettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Edition</DropdownMenuLabel>
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

// ==================================================================================================================================

type CommentCardSettingsEditFormProps = {
  comment: CommentsWithUsersByPostIdEndpointProps;
  isOpen: boolean;
  setComments: React.Dispatch<React.SetStateAction<CommentsWithUsersByPostIdEndpointProps[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CommentCardSettingsEditForm({ comment, isOpen, setIsOpen, setComments }: CommentCardSettingsEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { id, content } = comment;
  const form = useForm<z.infer<typeof schemaNewCommentForm>>({
    resolver: zodResolver(schemaNewCommentForm),
    defaultValues: {
      content,
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaNewCommentForm>) => {
    const toastId = toast.loading("Mise à jour du commentaire en cours...");
    setIsLoading(true);

    const commentUpdated = await patch<CommentsWithUsersByPostIdEndpointProps>(`comments/${id}`, values);

    if (!commentUpdated.success) {
      toast.error(commentUpdated.message);
      return;
    }

    setComments((prevComments) =>
      prevComments.map((c) => (c.id === id ? { ...c, content: values.content, updatedAt: new Date() } : c))
    );

    setIsLoading(false);
    toast.success(commentUpdated.message, { id: toastId });
    setIsOpen(false);
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Modification du commentaire</CredenzaTitle>
          <CredenzaDescription>Mettez à jour le commentaire ci-dessous.</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
              <div className="mt-1">
                <FormTextAreaField name="content" form={form} placeholder="Modifier la visibilité du commentaire..." />
              </div>
              <div className="flex max-md:flex-col justify-end gap-2">
                <CredenzaClose asChild>
                  <Button variant="outline">Annuler</Button>
                </CredenzaClose>
                <Button className="max-md:order-first" type="submit" isLoading={isLoading}>
                  Modifier
                </Button>
              </div>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

// ==================================================================================================================================

type CommentCardSettingsDeleteFormProps = {
  comment: CommentsWithUsersByPostIdEndpointProps;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<CommentsWithUsersByPostIdEndpointProps[]>>;
};

function CommentCardSettingsDeleteForm({
  comment,
  isOpen,
  setIsOpen,
  setComments,
}: CommentCardSettingsDeleteFormProps) {
  const { id } = comment;

  const handleClick = async () => {
    const toastId = toast.loading("Suppression du commentaire en cours...");

    const commentDeleted = await del(`comments/${id}`);

    if (!commentDeleted.success) {
      toast.error(commentDeleted.message);
      return;
    }

    setComments((prevComments) => prevComments.filter((c) => c.id !== comment.id));

    toast.success(commentDeleted.message, { id: toastId });
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression de votre commentaire</AlertDialogTitle>
          <AlertDialogDescription>Vous supprimerez le commentaire suivant : {comment.content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ==================================================================================================================================

type NewCommentProps = {
  postId: string;
  setComments: React.Dispatch<React.SetStateAction<CommentsWithUsersByPostIdEndpointProps[]>>;
};

function NewComment({ postId, setComments }: NewCommentProps) {
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

    setComments((prevComments) => [...prevComments, newComment.data]);

    setIsLoading(false);
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
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.back();
  };

  return (
    <motion.div
      onClick={() => router.back()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/50 flex items-start justify-end p-6"
    >
      <button onClick={handleClick}>
        <X className="size-8 text-white/85 hover:text-white duration-200 transition-colors" />
      </button>
    </motion.div>
  );
}

// ==================================================================================================================================
