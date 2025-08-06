"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { CircleUserRoundIcon, LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, auth } = useAppData();

  return (
    <nav
      className="text-white shadow-md p-4 z-50 bg-cover bg-center"
      style={{ backgroundImage: "url('/Graphic.png')" }}
    >

      <div className="container mx-auto flex justify-between items-center">
      <Link
        href={"/posts"}
        className="text-xl font-bold text-white drop-shadow-lg"
      >
        GroovySpin
      </Link>
        <div className="md:hidden">
          <Button variant={"ghost"} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        <ul className="hidden md:flex justify-center items-center space-x-6 text-white">
          <li>
            <Link href={"/posts"} className="hover:text-gray-300">
              Home
            </Link>
          </li>
          {auth && (
            <li>
              <Link href={"/post/saved"} className="hover:text-gray-300">
                Saved Posts
              </Link>
            </li>
          )}
          {!loading && (
            <li>
              {auth ? (
                <Link href={"/profile"} className="hover:text-gray-300">
                  <CircleUserRoundIcon />
                </Link>
              ) : (
                <Link href={"/login"} className="hover:text-gray-300">
                  <LogIn />
                </Link>
              )}
            </li>
          )}
        </ul>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col justify-center items-center space-y-4 p-4 text-white bg-black shadow-md">
          <li>
            <Link href={"/"} className="hover:text-gray-300">
              Home
            </Link>
          </li>
          {auth && (
            <li>
              <Link href={"/post/saved"} className="hover:text-gray-300">
                Saved Posts
              </Link>
            </li>
          )}
          {!loading && (
            <li>
              {auth ? (
                <Link href={"/profile"} className="hover:text-gray-300">
                  <CircleUserRoundIcon />
                </Link>
              ) : (
                <Link href={"/login"} className="hover:text-gray-300">
                  <LogIn />
                </Link>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
