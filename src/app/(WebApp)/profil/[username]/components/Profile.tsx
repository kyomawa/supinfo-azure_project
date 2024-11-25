"use client";

import { User } from "@prisma/client";
import ProfileImageForm from "./ProfileImageForm";
import PostList from "./ProfilePostList";
import ProfileEditButton from "./ProfileForm";
import { useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Link } from "next-view-transitions";
import Image from "@/components/Image";
import UserIcon from "@/components/UserIcon";
import { motion, Variants } from "motion/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { del } from "@/utils/apiFn";

// ==================================================================================================================================

type ProfilePageProps = {
  user: User;
  posts: PostsByUserIdEndpointProps[];
  followers: User[];
  followings: User[];
};

export default function Profile({ user, posts, followers, followings }: ProfilePageProps) {
  return (
    <section className="flex flex-col gap-y-8">
      <UserCard user={user} postsCount={posts.length} followers={followers} followings={followings} />
      <span className="h-px w-full bg-neutral-150 dark:bg-white/10" />
      <PostList posts={posts} username={user.username} />
    </section>
  );
}

// ==================================================================================================================================

type UserCardProps = {
  user: User;
  postsCount: number;
  followers: User[];
  followings: User[];
};

function UserCard({ user: initialUser, postsCount, followers, followings }: UserCardProps) {
  const [user, setUser] = useState<User>(initialUser);
  const { id, username, image, bio } = user;
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const userConnectedOwnTheProfil = userConnectedId === id;

  return (
    <div className="flex gap-x-12 items-center">
      <ProfileImageForm image={image} username={username} id={id} />
      <div className="flex flex-col gap-y-6 w-full">
        {/* Username + Edit or Follow button */}
        <div className="flex justify-between gap-x-3">
          <span className="text-xl">{username}</span>
          {/* Button Edit */}
          <ProfileEditButton user={user} setUser={setUser} />
        </div>
        {/* Number of posts + followers + followings */}
        <div className="flex gap-x-3">
          <span>
            <span className="font-semibold">{postsCount}</span> publications
          </span>
          <UserCardFollower
            followers={followers}
            username={username}
            userConnectedOwnTheProfil={userConnectedOwnTheProfil}
          />
          <UserCardFollowing
            followings={followings}
            username={username}
            userConnectedOwnTheProfil={userConnectedOwnTheProfil}
          />
        </div>
        {/* Bio */}
        {bio ? <p>{bio}</p> : <p className="text-neutral-500 dark:text-white/40">Rédiger votre bio...</p>}
      </div>
    </div>
  );
}

// ==================================================================================================================================

type UserCardFollowerProps = {
  followers: User[];
  username: string;
  userConnectedOwnTheProfil: boolean;
};

function UserCardFollower({ followers: initialFollowers, username, userConnectedOwnTheProfil }: UserCardFollowerProps) {
  const [followers, setFollowers] = useState<User[]>(initialFollowers);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger>
        <span>
          <span className="font-semibold">{followers.length}</span> abonné(e)s
        </span>
      </CredenzaTrigger>
      <CredenzaContent disableOutsideClick={false} className="md:p-0">
        <CredenzaHeader className="md:p-6 md:pb-1">
          <CredenzaTitle>Abonnés</CredenzaTitle>
          <CredenzaDescription>Liste des utilisateurs abonnés à {username}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <ul className="md:px-3 md:pb-3">
            {followers.map(({ username, image, id }) => (
              <motion.li
                key={id}
                className="flex gap-x-3 justify-between w-full relative items-center"
                whileHover="hover"
              >
                <Link className="flex items-center gap-x-3 md:px-2 py-3 w-full" href={`/profil/${username}`}>
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
                  <span>{username}</span>
                </Link>
                {/* Delete button */}
                {userConnectedOwnTheProfil && (
                  <UserCardFollowDeleteButton
                    type="follower"
                    setFollows={setFollowers}
                    id={id}
                    title={`Suppression de ${username}`}
                    buttonText="Supprimer"
                    description={`En validant vous supprimerez ${username} de votre liste d'abonnés. Cette action est irréversible.`}
                  />
                )}
                {/* Hover Background */}
                <UserCardFollowHoverBackground />
              </motion.li>
            ))}
          </ul>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

// ==================================================================================================================================

type UserCardFollowingProps = {
  followings: User[];
  username: string;
  userConnectedOwnTheProfil: boolean;
};

function UserCardFollowing({
  followings: initialFollowings,
  username,
  userConnectedOwnTheProfil,
}: UserCardFollowingProps) {
  const [followings, setFollowings] = useState<User[]>(initialFollowings);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger>
        <span>
          <span className="font-semibold">{followings.length}</span> suivi(e)s
        </span>
      </CredenzaTrigger>
      <CredenzaContent disableOutsideClick={false} className="md:p-0">
        <CredenzaHeader className="md:p-6 md:pb-1">
          <CredenzaTitle>Suivies</CredenzaTitle>
          <CredenzaDescription>Liste des utilisateurs auxquels {username} suit</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <ul className="md:px-3 md:pb-3">
            {followings.map(({ username, image, id }) => (
              <motion.li
                key={id}
                className="flex gap-x-3 w-full relative items-center justify-between"
                whileHover="hover"
              >
                <Link className="flex items-center gap-x-3 md:px-2 py-3 w-full" href={`/profil/${username}`}>
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
                  <span>{username}</span>
                </Link>
                {/* Delete button */}
                {userConnectedOwnTheProfil && (
                  <UserCardFollowDeleteButton
                    id={id}
                    type="following"
                    title={`Suppression de ${username}`}
                    setFollows={setFollowings}
                    buttonText="Ne plus suivre"
                    description={`En validant vous supprimerez ${username} de votre liste de suivi. Cette action est irréversible.`}
                  />
                )}
                {/* Hover Background */}
                <UserCardFollowHoverBackground />
              </motion.li>
            ))}
          </ul>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

// ==================================================================================================================================

function UserCardFollowHoverBackground() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 0.45,
        type: "spring",
        stiffness: 175,
        damping: 20,
      }}
      variants={userCardFollowVariants}
      className="absolute inset-0 -z-[1] rounded-md bg-black/5 dark:bg-white/15"
    />
  );
}

// ==================================================================================================================================

type UserCardFollowDeleteButtonProps = {
  title: string;
  description: string;
  buttonText: string;
  type: string;
  setFollows: React.Dispatch<React.SetStateAction<User[]>>;
  id: string;
};

function UserCardFollowDeleteButton({
  id,
  title,
  description,
  buttonText,
  type,
  setFollows,
}: UserCardFollowDeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Suppression en cours...");

    const response = await del(`follow/${id}?type=${type}`);
    if (response.success) {
      toast.success(response.message, { id: toastId });
      if (setFollows) setFollows((follows) => follows.filter((follow) => follow.id !== id));
      setIsOpen(false);
    } else {
      toast.error(response.message, { id: toastId });
    }

    setIsLoading(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="md:mr-2">{buttonText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex max-md:flex-col justify-end gap-2">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            onClick={onSubmit}
            className="max-md:order-first"
            type="submit"
            variant="destructive"
            isLoading={isLoading}
          >
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ==================================================================================================================================

const userCardFollowVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

// ==================================================================================================================================
