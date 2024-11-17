import { searchMetadata } from "@/constants/metadata";

export const metadata = searchMetadata;

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-medium">Recherche</h1>
    </div>
  );
}
