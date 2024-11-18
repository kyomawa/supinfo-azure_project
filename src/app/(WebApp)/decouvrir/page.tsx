import { discoveryMetadata } from "@/constants/metadata";
import { get } from "@/utils/apiFn";
import PostList from "./components/PostList";

// ==================================================================================================================================

export const metadata = discoveryMetadata;

export default async function Page() {
  const posts = await get<PostEndpointProps[]>("post");

  return (
    <div className="p-6 min-h-dvh md:mr-[4.75rem] xl:mr-64">
      <div className="specialPostContainer flex flex-col gap-y-6">
        <h1 className="title1">Découvrir</h1>
        <PostList posts={posts.data || []} />
      </div>
    </div>
  );
}
// ==================================================================================================================================
