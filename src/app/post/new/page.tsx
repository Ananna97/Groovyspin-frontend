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
import { RefreshCw } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";
import {
  contributor_service,
  postCategories,
  useAppData,
} from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Addpost = () => {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const { fetchPosts } = useAppData();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    post_content: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e: any) => {
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
        `${contributor_service}/api/v1/post/new`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        post_content: "",
      });
      setContent("");

      setTimeout(() => {
        fetchPosts();
      }, 1000);

      router.push("/posts"); 
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (error) {
      toast.error("Error while adding post");
    } finally {
      setLoading(false);
    }
  };

  const [aiTitle, setAiTitle] = useState(false);
  const aiTitleResponse = async () => {
    try {
      setAiTitle(true);
      const { data } = await axios.post(`${contributor_service}/api/v1/ai/title`, {
        text: formData.title,
      });
      setFormData({ ...formData, title: data });
    } catch (error) {
      toast.error("Problem while fetching from AI");
    } finally {
      setAiTitle(false);
    }
  };

  const [aiDescription, setAiDescription] = useState(false);
  const aiDescriptionResponse = async () => {
    try {
      setAiDescription(true);
      const { data } = await axios.post(
        `${contributor_service}/api/v1/ai/descripiton`,
        {
          title: formData.title,
          description: formData.description,
        }
      );
      setFormData({ ...formData, description: data });
    } catch (error) {
      toast.error("Problem while fetching from AI");
    } finally {
      setAiDescription(false);
    }
  };

  const [aipostLoading, setAipostLoading] = useState(false);
  const aipostResponse = async () => {
    try {
      setAipostLoading(true);
      const { data } = await axios.post(`${contributor_service}/api/v1/ai/post`, {
        post: formData.post_content,
      });
      setContent(data.html);
      setFormData({ ...formData, post_content: data.html });
    } catch (error: any) {
      toast.error("Problem while fetching from AI");
    } finally {
      setAipostLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Post</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>
            <div className="flex items-center gap-2">
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                className={aiTitle ? "animate-pulse placeholder:opacity-60" : ""}
                required
              />
              {formData.title !== "" && (
                <Button type="button" onClick={aiTitleResponse} disabled={aiTitle}>
                  <RefreshCw className={aiTitle ? "animate-spin" : ""} />
                </Button>
              )}
            </div>

            <Label>Description</Label>
            <div className="flex items-center gap-2">
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter post description"
                className={aiDescription ? "animate-pulse placeholder:opacity-60" : ""}
                required
              />
              {formData.title !== "" && (
                <Button onClick={aiDescriptionResponse} type="button" disabled={aiDescription}>
                  <RefreshCw className={aiDescription ? "animate-spin" : ""} />
                </Button>
              )}
            </div>

            <Label>Category</Label>
            <Select
              onValueChange={(value: any) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={formData.category || "Select category"}
                />
              </SelectTrigger>
              <SelectContent>
                {postCategories?.map((e, i) => (
                  <SelectItem key={i} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <Label>Image Upload</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div>
              <Label>Post Content</Label>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Paste your post or type here. You can use rich text formatting.
                  Please add image after improving your grammar.
                </p>
                <Button
                  type="button"
                  size={"sm"}
                  onClick={aipostResponse}
                  disabled={aipostLoading}
                >
                  <RefreshCw
                    size={16}
                    className={aipostLoading ? "animate-spin" : ""}
                  />
                  <span className="ml-2">Fix Grammar</span>
                </Button>
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
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Addpost;
