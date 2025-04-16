import AddClient from "@/components/AddClient";
import BackButton from "@/components/BackButton";
import React from "react";

const page = () => {
  return (
    <main className="py-5 px-2 flex-1">
      <div>
        <BackButton />
      </div>
      <div className="mt-6 max-w-1/3">
        <AddClient />
      </div>
    </main>
  );
};

export default page;
