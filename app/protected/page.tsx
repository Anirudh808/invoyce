import { auth } from "@/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  console.log(session);
  return <div>{session && <p>Hello {session.user?.name}</p>}</div>;
};

export default page;
