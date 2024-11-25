import { searchMetadata } from "@/constants/metadata";

export const metadata = searchMetadata;

export default function Page() {
  return (
    <div className="md:p-6 pageHeight 2xl:pr-36">
      <section className="specialPostContainer flex flex-col gap-y-6">
        <h1 className="title1 border-b border-black/5 pb-4 dark:border-white/10 max-md:p-6">Recherche</h1>
      </section>
    </div>
  );
}
