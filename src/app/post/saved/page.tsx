"use client";
import PostCard from "@/components/PostCard";
import Loading from "@/components/loading";
import { useAppData } from "@/context/AppContext";
import React from "react";

const SavedPosts = () => {
  const { posts, savedPosts } = useAppData();

  if (!posts || !savedPosts) {
    return <Loading />;
  }

  const filteredPosts = posts.filter((post) =>
    savedPosts.some((saved) => saved.post_id === post.id.toString())
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mt-2">Saved Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((e, i) => {
            return (
              <PostCard
                key={i}
                image={e.image}
                title={e.title}
                desc={e.description}
                id={e.id}
                time={e.created_at}
              />
            );
          })
        ) : (
          <p>No saved posts yet!</p>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
