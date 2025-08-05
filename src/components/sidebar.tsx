"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import { Circle } from "lucide-react";
import { postCategories, useAppData } from "@/context/AppContext";

const SideBar = () => {
  const { searchQuery, setSearchQuery, setCategory } = useAppData();

  return (
    <Sidebar className="bg-black text-white min-h-screen">
      <SidebarHeader className="bg-black text-white text-2xl font-bold px-4 py-3">
        GroovySpin
      </SidebarHeader>

      <SidebarContent className="bg-black text-white px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Search</SidebarGroupLabel>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Your Desired post"
            className="bg-gray-900 text-white placeholder-gray-400 border-gray-700"
          />

          <SidebarGroupLabel className="text-white mt-4">Categories</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              {/* ALL */}
              <SidebarMenuButton
                className="text-white hover:text-gray-400 transition-colors"
                onClick={() => setCategory("")}
              >
                <Circle className="w-4 h-4 mr-2" />
                <span>All</span>
              </SidebarMenuButton>

              {/* Other categories */}
              {postCategories?.map((category, i) => (
                <SidebarMenuButton
                  key={i}
                  className="text-white hover:text-gray-400 transition-colors"
                  onClick={() => setCategory(category)}
                >
                  <Circle className="w-4 h-4 mr-2" />
                  <span>{category}</span>
                </SidebarMenuButton>
              ))}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
