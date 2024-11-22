// ==================================================================================================================================

import { User } from "@prisma/client";
import ProfileImageForm from "./ProfileImageForm";

type ProfilePageProps = {
  user: User;
};

export default function Profile({ user }: ProfilePageProps) {
  return (
    <div>
      <section className="flex flex-col gap-y-12">
        <UserCard user={user} />
        <PostList />
      </section>
    </div>
  );
}

// ==================================================================================================================================

type UserCardProps = {
  user: User;
};

function UserCard({ user }: UserCardProps) {
  const { username, image } = user;
  return (
    <div className="flex gap-x-12 items-center">
      <ProfileImageForm image={image} username={username} />
      <span className="text-xl">{username}</span>
    </div>
  );
}

// ==================================================================================================================================

function PostList() {
  return (
    <ul>
      <li>Post 1</li>
      <li>Post 2</li>
    </ul>
  );
}
