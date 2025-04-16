import { auth } from "@/auth";
import AddUserBusiness from "@/components/addUserBusiness";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const loggedInUser = await auth();
  if (loggedInUser?.user && loggedInUser.user.id) {
    return (
      <div>
        <AddUserBusiness user={loggedInUser.user} />
      </div>
    );
  } else {
    redirect("/signin");
  }
};

export default page;
