import { messagesMetadata } from "@/constants/metadata";

export const metadata = messagesMetadata;

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-medium">Messages</h1>
    </div>
  );
}
