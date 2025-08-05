"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";
import {
  contributor_service,
  post_service,
  postCategories,
  useAppData,
} from "@/context/AppContext";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditPostPage = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const router = useRouter();
  const { id } = useParams();
  const { fetchPosts } = useAppData();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null as File | null,
    post_content: "",
  });

  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${post_service}/api/v1/post/${id}`);
        const post = data.post;

        setFormData({
          title: post.title,
          description: post.description,
          category: post.category,
          image: null,
          post_content: post.post_content,
        });

        setContent(post.post_content);
        setExistingImage(post.image);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fromDataToSend = new FormData();
    fromDataToSend.append("title", formData.title);
    fromDataToSend.append("description", formData.description);
    fromDataToSend.append("post_content", formData.post_content);
    fromDataToSend.append("category", formData.category);
    if (formData.image) {
      fromDataToSend.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${contributor_service}/api/v1/post/${id}`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      fetchPosts();
      router.push("/posts");
      setTimeout(() => {
        window.location.reload();
      }, 200);

    } catch (error) {
      console.error("Error while updating post:", error);
      toast.error("Error while updating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Edit Post</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              required
            />

            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter post description"
              required
            />

            <Label>Category</Label>
            <Select
              onValueChange={(value: string) =>
                setFormData({ ...formData, category: value })
              }
              defaultValue={formData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {postCategories.map((cat, i) => (
                  <SelectItem key={i} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Image Upload</Label>
            {existingImage && !formData.image && (
              <img
                src={existingImage}
                alt="Existing"
                className="w-40 h-40 object-cover rounded mb-2"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleFileChange} />

            <Label>Post Content</Label>
            <div className="text-sm text-muted-foreground mb-2">
              Paste your post or type here. You can use rich text formatting.
            </div>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => {
                setContent(newContent);
                setFormData({ ...formData, post_content: newContent });
              }}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Update Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPostPage;
