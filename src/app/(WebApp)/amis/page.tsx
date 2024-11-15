import { friendsMetadata } from "@/constants/metadata";

export const metadata = friendsMetadata;

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-medium">Amis</h1>
    </div>
  );
}
