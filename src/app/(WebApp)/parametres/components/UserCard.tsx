import Image from "@/components/Image";
import { User } from "@prisma/client";
import UserCardDeleteButton from "./UserCardDeleteButton";

// ==================================================================================================================================

type UserCardProps = {
  user: User;
};

export default function UserCard({ user }: UserCardProps) {
  const { id, name, username, email, emailVerified, image, createdAt } = user;

  return (
    <div className="flex max-sm:flex-col gap-6 p-4 border items-start dark:bg-white/10 bg-black/5 dark:border-white/5 border-black/[0.025] rounded-lg">
      {image ? (
        <Image
          src={image}
          alt="user"
          containerClassName="size-3/4 xs:size-4/6 sm:size-24 max-sm:aspect-square rounded-full self-center"
          className="rounded-full"
          sizes="75vw, (min-width: 768px) 6rem"
          quality={100}
        />
      ) : (
        <UserIcon />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1">
        <Field label="Nom" value={name || "Nom inconnu"} />
        <Field label="Email" value={email || "Email inconnu"} />
        <Field label="Statut de l'email" value={emailVerified ? "Email vérifié" : "Email non vérifié"} />
        <Field label="Membre depuis le" value={new Date(createdAt).toLocaleDateString("fr", { dateStyle: "long" })} />
        <Field label="Pseudo" value={`@${username}`} />
      </div>
      <UserCardDeleteButton userId={id} />
    </div>
  );
}

// ==================================================================================================================================

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-sm text-neutral-500 dark:text-white/40">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

// ==================================================================================================================================

function UserIcon() {
  return (
    <svg
      className="size-3/4 xs:size-4/6 self-center sm:size-24 max-sm:aspect-square "
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z"
        fill="white"
      />
      <path
        className="fill-primary-700 dark:fill-primary-800"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.7778 29.3794C29.128 26.5196 32 21.5952 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 21.4997 2.77478 26.3512 7.00073 29.2311C7.02307 27.9152 7.55551 26.658 8.48771 25.7258C9.44028 24.7732 10.7322 24.2381 12.0794 24.2381H19.6984C21.0455 24.2381 22.3375 24.7732 23.2901 25.7258C24.2426 26.6784 24.7778 27.9703 24.7778 29.3175V29.3794ZM20.9683 14.0794C20.9683 16.8846 18.6941 19.1587 15.8889 19.1587C13.0836 19.1587 10.8095 16.8846 10.8095 14.0794C10.8095 11.2741 13.0836 9 15.8889 9C18.6941 9 20.9683 11.2741 20.9683 14.0794Z"
      />
    </svg>
  );
}
