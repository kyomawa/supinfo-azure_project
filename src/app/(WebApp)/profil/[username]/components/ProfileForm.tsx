import { User } from "@prisma/client";

// ==================================================================================================================================

type ProfileFormProps = {
  user: User;
  postsCount: number;
  followers: User[];
  followings: User[];
};

export default function ProfileForm({ user, postsCount, followers, followings }: ProfileFormProps) {
  const { username, email, bio, createdAt } = user;
  return (
    <div className="flex flex-col gap-y-6">
      {/* Username + Edit or Follow button */}
      <div className="flex justify-between gap-x-3">
        <span className="text-xl">{username}</span>
      </div>
      {/* Number of posts + followers + followings */}
      <div className="flex gap-x-3">
        <span>
          <span className="font-semibold">{postsCount}</span> publications
        </span>
        <span>
          <span className="font-semibold">{followers.length}</span> abonné(e)s
        </span>
        <span>
          <span className="font-semibold">{followings.length}</span> suivi(e)s
        </span>
      </div>
      {/* Bio */}
      {bio ? <p>{bio}</p> : <p className="text-neutral-500 dark:text-white/40">Rédiger votre bio...</p>}
    </div>
  );
}

// ==================================================================================================================================
