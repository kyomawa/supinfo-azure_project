import { searchMetadata } from "@/constants/metadata";
import SearchBar from "./components/SearchBar";

export const metadata = searchMetadata;

export default function Page() {
  return (
    <div className="md:p-6 p-4 pageHeight 2xl:pr-36">
      <section className="specialPostContainer">
        <SearchBar />
      </section>
    </div>
  );
}
