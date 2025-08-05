"use client";
import PostCard from "@/components/PostCard";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppData } from "@/context/AppContext";
import { Filter } from "lucide-react";
import React from "react";

const Posts = () => {
  const { toggleSidebar } = useSidebar();
  const { loading, postLoading, posts } = useAppData();
  console.log(posts);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="contianer mx-auto px-4">
          <div className="flex justify-between items-center my-5">
            <h1 className="text-3xl font-bold">Latest Posts</h1>
            <Button
              onClick={toggleSidebar}
              className="flex items-center gap-2 px-4 bg-primary text-white"
            >
              <Filter size={18} />
              <span>Filter Posts</span>
            </Button>
          </div>
          {postLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {posts?.length === 0 && <p>No Posts Yet</p>}
              {posts &&
                posts.map((e, i) => {
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
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
