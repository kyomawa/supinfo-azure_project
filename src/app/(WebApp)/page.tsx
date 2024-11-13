import { homeMetadata } from "@/constants/metadata";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-medium">Page d&apos;accueil qui sera le feed</h1>
    </div>
  );
}
