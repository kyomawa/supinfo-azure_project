import PostList from "./PostList";

// ==================================================================================================================================

type PostContainerProps = {
  initialPosts: PostEndpointProps[];
  urlToFetch: string;
};

export default function PostContainer({ initialPosts, urlToFetch }: PostContainerProps) {
  return (
    <div className="md:p-6 h-[calc(100vh-4.3125rem)] 2xl:pr-36 scroll-smooth md:snap-y md:snap-mandatory md:overscroll-y-contain md:scrollbarVertical md:overflow-y-auto">
      <div className="specialPostContainer">
        <PostList initialPosts={initialPosts} urlToFetch={urlToFetch} />
      </div>
    </div>
  );
}

// ==================================================================================================================================
