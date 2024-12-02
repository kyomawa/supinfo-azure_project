"use client";

import { Search } from "lucide-react";
import { useState, useRef } from "react";
import ProfilePostCard from "../../profil/[username]/components/ProfilePostCard";
import { SearchPostsProps } from "@/constants/type";
import { get } from "@/utils/apiFn";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";

// ===================================================================================================

export default function SearchBar() {
  const [posts, setPosts] = useState<SearchPostsProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");

  const loadMorePosts = async (query: string, initial = false) => {
    if (isLoading || (!hasMore && !initial) || !query.trim()) {
      if (!query.trim()) {
        setPosts([]);
        setSkip(0);
        setHasMore(true);
      }
      return;
    }

    setIsLoading(true);
    try {
      const result = await get<SearchPostsProps[]>(`posts/search?q=${query}&skip=${initial ? 0 : skip}&take=9`, {
        tags: ["posts", "search"],
        revalidateTime: 45,
      });

      if (result.success && result.data) {
        setPosts((prevPosts) => (initial ? result.data : [...prevPosts, ...result.data]));
        setSkip(initial ? result.data.length : skip + result.data.length);
        if (result.data.length < 9) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Erreur lors du chargement des publications :", e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-6">
      <SearchForm
        query={query}
        setQuery={setQuery}
        setPosts={setPosts}
        setSkip={setSkip}
        setHasMore={setHasMore}
        loadMorePosts={loadMorePosts}
      />
      <SearchResult posts={posts} loadMorePosts={() => loadMorePosts(query, false)} isLoading={isLoading} />
    </div>
  );
}

// ===================================================================================================

type SearchResultProps = {
  posts: SearchPostsProps[];
  loadMorePosts: () => Promise<void>;
  isLoading: boolean;
};

function SearchResult({ posts, loadMorePosts, isLoading }: SearchResultProps) {
  return (
    <>
      {posts.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 relative">
          {posts.map((post) => (
            <ProfilePostCard key={post.id} post={post} username={post.creator.username} />
          ))}
          {/* Infinite Scroll Trigger */}
          <motion.li
            key={posts.length}
            viewport={{ once: true, margin: "0px" }}
            onViewportEnter={loadMorePosts}
            className="w-full absolute left-0 right-0 bottom-0 h-1 -z-10"
          />
        </ul>
      )}
      <AnimatePresence>
        {isLoading && (
          <div className="py-4 flex justify-center">
            <Loader className="size-8 animate-spin" />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ===================================================================================================

type SearchFormProps = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setPosts: React.Dispatch<React.SetStateAction<SearchPostsProps[]>>;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  loadMorePosts: (query: string, initial: boolean) => Promise<void>;
};

function SearchForm({ query, setQuery, setPosts, setSkip, setHasMore, loadMorePosts }: SearchFormProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setPosts([]);
      setSkip(0);
      setHasMore(true);

      await loadMorePosts(value, true);
    }, 300);
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-neutral-400" />
      <Input
        value={query}
        onChange={handleInputChange}
        variant="searchbar"
        type="search"
        placeholder="Rechercher une publication..."
      />
    </div>
  );
}

// ===================================================================================================
