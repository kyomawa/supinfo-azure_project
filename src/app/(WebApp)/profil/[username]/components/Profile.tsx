"use client";

import { Follow, FollowStatus, User } from "@prisma/client";
import ProfileImageForm from "./ProfileImageForm";
import ProfilePostList from "./ProfilePostList";
import ProfileEditButton from "./ProfileForm";
import { useEffect, useState } from "react";
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
import { del, patch, post } from "@/utils/apiFn";
import { BellOff, BellRing } from "lucide-react";
import TooltipComponent from "@/components/TooltipComponent";

// ==================================================================================================================================

type ProfilePageProps = {
  user: User;
  mustHideFollows: boolean;
  userPostCount: string;
  posts: PostsByUserIdEndpointProps[];
  followers: FollowerByUserIdEndpointProps[];
  followings: FollowingByUserIdEndpointProps[];
};

export default function Profile({
  user,
  posts,
  followers,
  followings,
  userPostCount,
  mustHideFollows,
}: ProfilePageProps) {
  const session = useSession();
  const userConnectedId = session.data?.user.id;
  const userConnectedIsSuscribed = followers.some(
    (follower) => follower.id === userConnectedId && follower.status !== "PENDING"
  );
  const userConnectedFollowerId = followers.find((follower) => follower.id === userConnectedId)?.id;
  const userConnectedOwnTheProfil = userConnectedId === user.id;

  const initialFollowStatus = followers.find((follower) => follower.id === userConnectedId)?.status || null;

  return (
    <section className="flex flex-col gap-y-8">
      <UserCard
        user={user}
        followers={followers}
        followings={followings}
        userPostCount={userPostCount}
        mustHideFollows={mustHideFollows}
        initialFollowStatus={initialFollowStatus}
        userConnectedIsSuscribed={userConnectedIsSuscribed}
        userConnectedOwnTheProfil={userConnectedOwnTheProfil}
        userConnectedFollowerId={userConnectedFollowerId}
      />
      <span className="h-px w-full bg-neutral-150 dark:bg-white/10" />
      <ProfilePostList
        posts={posts}
        user={user}
        userConnectedIsSuscribed={userConnectedIsSuscribed}
        userConnectedOwnTheProfil={userConnectedOwnTheProfil}
      />
    </section>
  );
}

// ==================================================================================================================================

type UserCardProps = {
  user: User;
  followers: FollowerByUserIdEndpointProps[];
  followings: FollowingByUserIdEndpointProps[];
  userPostCount: string;
  initialFollowStatus: FollowStatus | null;
  mustHideFollows: boolean;
  userConnectedOwnTheProfil: boolean;
  userConnectedIsSuscribed: boolean;
  userConnectedFollowerId: string | undefined;
};

function UserCard({
  user: initialUser,
  followers,
  initialFollowStatus,
  followings,
  userPostCount,
  mustHideFollows,
  userConnectedOwnTheProfil,
  userConnectedIsSuscribed,
  userConnectedFollowerId,
}: UserCardProps) {
  const [user, setUser] = useState<User>(initialUser);
  const { id, username, image, bio } = user;

  return (
    <div className="flex gap-x-12 items-center">
      <ProfileImageForm
        image={image}
        username={username}
        id={id}
        userConnectedOwnTheProfil={userConnectedOwnTheProfil}
      />
      <div className="flex flex-col gap-y-6 w-full">
        {/* Username + Edit or Follow button */}
        <div className="flex justify-between items-center gap-x-3">
          <span className="text-xl">{username}</span>
          {/* Button Edit */}
          {userConnectedOwnTheProfil ? (
            <ProfileEditButton user={user} setUser={setUser} />
          ) : (
            <div className="flex gap-x-1 md:mr-2">
              <UserCardFollowButton initialFollowStatus={initialFollowStatus} profileUserId={id} />
              {userConnectedIsSuscribed && (
                <NotificationButton userId={id} userConnectedFollowerId={userConnectedFollowerId} />
              )}
            </div>
          )}
        </div>
        {/* Number of posts + followers + followings */}
        <div className="flex gap-x-3">
          <span>
            <span className="font-semibold">{userPostCount}</span> publications
          </span>
          <UserCardFollower
            mustHideFollows={mustHideFollows}
            followers={followers}
            username={username}
            userConnectedOwnTheProfil={userConnectedOwnTheProfil}
          />
          <UserCardFollowing
            mustHideFollows={mustHideFollows}
            followings={followings}
            username={username}
            userConnectedOwnTheProfil={userConnectedOwnTheProfil}
          />
        </div>
        {/* Bio */}
        {bio ? (
          <p>{bio}</p>
        ) : userConnectedOwnTheProfil ? (
          <p className="text-neutral-500 dark:text-white/40">Rédiger votre bio...</p>
        ) : null}
      </div>
    </div>
  );
}

// ==================================================================================================================================

type NotificationButtonProps = {
  userId: string;
  userConnectedFollowerId: string | undefined;
};

function NotificationButton({ userConnectedFollowerId, userId }: NotificationButtonProps) {
  const [isNotified, setIsNotified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleNotification = async () => {
    if (!userConnectedFollowerId) return;

    setIsLoading(true);
    const toastId = toast.loading("Mise à jour des notifications...");

    const response = await patch<Follow>(`follow/notify`, {
      followerId: userConnectedFollowerId,
      followingId: userId,
    });

    if (response.success) {
      setIsNotified(response.data.notifyOnNewPost);
      toast.success(response.message, { id: toastId });
    } else {
      toast.error(response.message, { id: toastId });
    }

    setIsLoading(false);
  };

  return (
    <TooltipComponent side="bottom" label={isNotified ? "Désactiver les notifications" : "Activer les notifications"}>
      <Button
        className=""
        variant={isNotified ? "secondary" : "default"}
        onClick={toggleNotification}
        isLoading={isLoading}
      >
        {isNotified ? <BellOff className="size-[1.125rem]" /> : <BellRing className="size-[1.125rem]" />}
      </Button>
    </TooltipComponent>
  );
}

// ==================================================================================================================================

type UserCardFollowButtonProps = {
  initialFollowStatus: FollowStatus | null;
  profileUserId: string;
};

function UserCardFollowButton({ initialFollowStatus, profileUserId }: UserCardFollowButtonProps) {
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(initialFollowStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const followerId = session?.user.id as string;

  useEffect(() => {
    setFollowStatus(initialFollowStatus);
  }, [initialFollowStatus]);

  const handleFollow = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Action en cours...");

    if (followStatus === "CONFIRMED" || followStatus === "PENDING") {
      const response = await del(`follow?followerId=${followerId}&followingId=${profileUserId}`);
      if (response.success) {
        toast.success("Vous ne suivez plus cet utilisateur.", { id: toastId });
        setFollowStatus(null);
      } else {
        toast.error(response.message, { id: toastId });
      }
    } else {
      const response = await post<Follow>("follow", {
        followerId,
        followingId: profileUserId,
      });
      if (response.success) {
        const newStatus: FollowStatus = response.data.status;
        toast.success(
          newStatus === "CONFIRMED" ? "Vous suivez maintenant cet utilisateur." : "Demande de suivi envoyée.",
          { id: toastId }
        );
        setFollowStatus(newStatus);
      } else {
        toast.error(response.message, { id: toastId });
      }
    }

    setIsLoading(false);
  };

  const getButtonLabel = () => {
    if (followStatus === "CONFIRMED") return "Abonné";
    if (followStatus === "PENDING") return "Demande envoyée";
    return "Suivre";
  };

  return (
    <Button variant={followStatus ? "secondary" : "default"} onClick={handleFollow} isLoading={isLoading}>
      {getButtonLabel()}
    </Button>
  );
}

// ==================================================================================================================================

type UserCardFollowerProps = {
  mustHideFollows: boolean;
  followers: FollowerByUserIdEndpointProps[];
  username: string;
  userConnectedOwnTheProfil: boolean;
};

function UserCardFollower({
  followers: initialFollowers,
  username,
  userConnectedOwnTheProfil,
  mustHideFollows,
}: UserCardFollowerProps) {
  const [followers, setFollowers] = useState(initialFollowers);
  const followersConfirmed = followers.filter((follower) => follower.status === "CONFIRMED");
  const [isOpen, setIsOpen] = useState(false);

  if (mustHideFollows)
    return (
      <span>
        <span className="font-semibold">{followersConfirmed.length}</span> abonné(e)s
      </span>
    );

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger>
        <span>
          <span className="font-semibold">{followersConfirmed.length}</span> abonné(e)s
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
  mustHideFollows: boolean;
  followings: FollowerByUserIdEndpointProps[];
  username: string;
  userConnectedOwnTheProfil: boolean;
};

function UserCardFollowing({
  followings: initialFollowings,
  username,
  userConnectedOwnTheProfil,
  mustHideFollows,
}: UserCardFollowingProps) {
  const [followings, setFollowings] = useState(initialFollowings);
  const followingsConfirmed = followings.filter((following) => following.status === "CONFIRMED");
  const [isOpen, setIsOpen] = useState(false);

  if (mustHideFollows)
    return (
      <span>
        <span className="font-semibold">{followingsConfirmed.length}</span> suivi(e)s
      </span>
    );

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger>
        <span>
          <span className="font-semibold">{followingsConfirmed.length}</span> suivi(e)s
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
  setFollows: React.Dispatch<React.SetStateAction<FollowerByUserIdEndpointProps[]>>;
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
  const { data: session } = useSession();
  const userId = session?.user.id;

  const onSubmit = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Suppression en cours...");

    const followerId = type === "follower" ? id : userId;
    const followingId = type === "follower" ? userId : id;

    const response = await del(`follow?followerId=${followerId}&followingId=${followingId}`);
    if (response.success) {
      toast.success(response.message, { id: toastId });
      setFollows((follows) => follows.filter((user) => user.id !== id));
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
