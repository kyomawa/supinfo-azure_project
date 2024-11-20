import PostList from "./PostList";

// ==================================================================================================================================

type PostContainerProps = {
  title: string;
  initialPosts: PostEndpointProps[];
};

export default function PostContainer({ title, initialPosts }: PostContainerProps) {
  return (
    <div className="md:p-6 h-dvh 2xl:pr-36 scroll-smooth md:snap-y md:snap-mandatory md:overscroll-y-contain md:scrollbarVertical md:overflow-y-auto">
      <div className="specialPostContainer flex flex-col gap-y-6">
        <h1 className="title1 border-b border-black/5 pb-4 dark:border-white/10 max-md:p-6">{title}</h1>
        <PostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}

// ==================================================================================================================================
