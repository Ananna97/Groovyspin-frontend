"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { get } from "http";

export const user_service="https://user-service-rq1d.onrender.com";
export const contributor_service="https://contributor-service.onrender.com";
export const post_service="https://post-service-u2s4.onrender.com";

export const postCategories=[
  "Music",
  "Books",
  "Movies"
];

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  bio: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  post_content: string;
  image: string;
  category: string;
  contributor: string;
  created_at: string;
}

interface SavedPostType {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  auth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;
  posts: Post[] | null;
  postLoading: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  fetchPosts: () => Promise<void>;
  savedPosts: SavedPostType[] | null;
  getSavedPosts: () => Promise<void>;
}

const AppContext=createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps>=({ children }) => {
  const [user, setUser]=useState<User | null>(null);
  const [auth, setAuth]=useState(false);
  const [loading, setLoading]=useState(true);

  async function fetchUser() {
    try {
      const token=Cookies.get("token");

      const { data }=await axios.get(`${user_service}/api/v1/myProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const [postLoading, setPostLoading]=useState(true);

  const [posts, setPosts]=useState<Post[] | null>(null);
  const [category, setCategory]=useState("");
  const [searchQuery, setSearchQuery]=useState("");

  async function fetchPosts() {
    setPostLoading(true);
    try {
      const { data }=await axios.get(
        `${post_service}/api/v1/post/all?searchQuery=${searchQuery}&category=${category}`
      );

      setPosts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setPostLoading(false);
    }
  }

  const [savedPosts, setSavedPosts]=useState<SavedPostType[] | null>(null);

  async function getSavedPosts() {
    const token=Cookies.get("token");
    try {
      const { data }=await axios.get(
        `${post_service}/api/v1/post/saved/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedPosts(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setAuth(false);

    toast.success("User Logged Out!");
  }

  useEffect(() => {
    fetchUser();
    getSavedPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, category]);
  return (
    <AppContext.Provider
      value={{
        user,
        setAuth,
        auth,
        setLoading,
        loading,
        setUser,
        logoutUser,
        posts,
        postLoading,
        setCategory,
        setSearchQuery,
        searchQuery,
        fetchPosts,
        savedPosts,
        getSavedPosts,
      }}
    >
      <GoogleOAuthProvider clientId="1074374054543-l10qjl3pa608pjcnuqhck3a78mpc4duv.apps.googleusercontent.com">
        {children}
        <Toaster />
      </GoogleOAuthProvider>
    </AppContext.Provider>
  );
};

export const useAppData=(): AppContextType => {
  const context=useContext(AppContext);
  if (!context) {
    throw new Error("Useappdata must be used within AppProvider.");
  }
  return context;
};
