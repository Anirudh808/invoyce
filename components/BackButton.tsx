"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      className="bg-indigo-500 cursor-pointer hover:bg-indigo-800 text-white"
      onClick={() => router.back()}
    >
      <ArrowLeft size={20} /> Back
    </Button>
  );
};

export default BackButton;
