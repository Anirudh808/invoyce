import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const loggedInUser = await auth();
  if (loggedInUser?.user) {
    redirect("/console/dashboard");
  } else return <div>page</div>;
};

export default page;
