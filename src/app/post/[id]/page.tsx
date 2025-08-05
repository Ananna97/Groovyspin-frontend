"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  contributor_service,
  Post,
  post_service,
  useAppData,
  User,
} from "@/context/AppContext";
import axios from "axios";
import {
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  Trash2Icon,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  username: string;
}

const PostPage = () => {
  const { auth, user, fetchPosts, savedPosts, getSavedPosts } = useAppData();
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [contributor, setContributor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);

  async function fetchComment() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${post_service}/api/v1/comment/${id}`);
      setComments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComment();
  }, [id]);

  const [comment, setComment] = useState("");

  async function addComment() {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${post_service}/api/v1/comment/${id}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      setComment("");
      fetchComment();
    } catch (error) {
      toast.error("Problem while adding comment");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSinglePost() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${post_service}/api/v1/post/${id}`);
      setPost(data.post);
      setContributor(data.contributor);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const deleteComment = async (id: string) => {
    if (confirm("Are you sure you want to delete this comment")) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.delete(
          `${post_service}/api/v1/comment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        fetchComment();
      } catch (error) {
        toast.error("Problem while deleting comment");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  async function deletePost() {
    if (confirm("Are you sure you want to delete this post")) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.delete(
          `${contributor_service}/api/v1/post/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        router.push("/posts");
        setTimeout(() => {
          fetchPosts();
        }, 200);
      } catch (error) {
        toast.error("Problem while deleting post");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (savedPosts && savedPosts.some((b) => b.post_id === id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [savedPosts, id]);

  async function savePost() {
    const token = Cookies.get("token");
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${post_service}/api/v1/save/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      setSaved(!saved);
      getSavedPosts();
    } catch (error) {
      toast.error("Problem while saving post");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSinglePost();
  }, [id]);

  if (!post) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <Link
              className="flex items-center gap-2"
              href={`/profile/${contributor?._id}`}
            >
              <img
                src={contributor?.image}
                className="w-8 h-8 rounded-full"
                alt=""
              />
              {contributor?.name}
            </Link>
            {auth && (
              <Button
                variant={"ghost"}
                className="mx-3"
                size={"lg"}
                disabled={loading}
                onClick={savePost}
              >
                {saved ? <BookmarkCheck /> : <Bookmark />}
              </Button>
            )}
            {post.contributor === user?._id && (
              <>
                <Button
                  size={"sm"}
                  onClick={() => router.push(`/post/edit/${id}`)}
                >
                  <Edit />
                </Button>
                <Button
                  variant={"destructive"}
                  className="mx-2"
                  size={"sm"}
                  onClick={deletePost}
                  disabled={loading}
                >
                  <Trash2Icon />
                </Button>
              </>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <img
            src={post.image}
            alt=""
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-lg text-gray-700 mb-4">{post.description}</p>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.post_content }}
          />
        </CardContent>
      </Card>

      {auth && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Add a comment</h3>
          </CardHeader>
          <CardContent>
            <Label htmlFor="comment">Your Comment</Label>
            <Input
              id="comment"
              placeholder="Type your comment here"
              className="my-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={addComment} disabled={loading}>
              {loading ? "Adding comment..." : "Post Comment"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">All Comments</h3>
        </CardHeader>
        <CardContent>
          {comments && comments.length > 0 ? (
            comments.map((e, i) => {
              return (
                <div key={i} className="border-b py-2 flex items-center gap-3">
                  <div>
                    <p className="font-semibold flex items-center gap-1">
                      <span className="user border border-gray-400 rounded-full p-1">
                        <User2 />
                      </span>
                      {e.username}
                    </p>
                    <p>{e.comment}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(e.created_at).toLocaleString()}
                    </p>
                  </div>
                  {e.user_id === user?._id && (
                    <Button
                      onClick={() => deleteComment(e.id)}
                      variant={"destructive"}
                      disabled={loading}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <p>No Comments Yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostPage;
