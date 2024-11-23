import { User } from "@prisma/client";
import ProfileImageForm from "./ProfileImageForm";
import ProfileForm from "./ProfileForm";
import PostList from "./ProfilePostList";

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

function UserCard({ user, postsCount, followers, followings }: UserCardProps) {
  const { username, image } = user;
  return (
    <div className="flex gap-x-12 items-center">
      <ProfileImageForm image={image} username={username} />
      <ProfileForm user={user} postsCount={postsCount} followers={followers} followings={followings} />
    </div>
  );
}

// ==================================================================================================================================
