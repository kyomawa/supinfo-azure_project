// ==================================================================================================================================

import Image from "@/components/Image";
import UserIcon from "@/components/UserIcon";

type ProfilePageProps = {
  user: UserByIdEndpointProps;
};

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div>
      <section>
        <UserCard user={user} />
      </section>
    </div>
  );
}

// ==================================================================================================================================

type UserCardProps = {
  user: UserByIdEndpointProps;
};

function UserCard({ user }: UserCardProps) {
  const { username, image } = user;
  return (
    <div className="flex gap-x-12 items-center ">
      {image ? (
        <Image
          src={image}
          alt={`Avatar de ${username}`}
          containerClassName="rounded-full size-[9.5rem] shrink-0"
          className="rounded-full"
          sizes="9.5rem"
        />
      ) : (
        <UserIcon className="rounded-full  size-[9.5rem] shrink-0" />
      )}
      <span className="text-xl">{username}</span>
    </div>
  );
}
