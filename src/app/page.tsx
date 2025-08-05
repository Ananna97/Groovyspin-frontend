import { redirect } from "next/navigation";
import React from "react";

const Home = () => {
  return redirect("/posts");
};

export default Home;
