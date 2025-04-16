"use client";

import { GetUserWithBusiness } from "@/lib/types";
import { Loader2, User2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { changePassword, changeProfilePhoto } from "@/lib/actions/updateUser";
import { cn } from "@/lib/utils";
import UserProfileInfo from "./UserProfileInfo";
import { signOut } from "next-auth/react";

const UserProfile = () => {
  const [user, setUser] = useState<GetUserWithBusiness>();
  const [newImage, setNewImage] = useState<File>();
  const [imageUploading, setImageUploading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<{
    isError: boolean;
    message: string;
  }>();

  useEffect(() => {
    async function getData() {
      const response = await fetch("/api/users/");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser(result.data);
        }
      }
    }
    getData();
  }, []);

  return (
    <div className=" h-[90vh]">
      <h1 className="text-indigo-900 font-bold text-4xl mb-5">
        Account Center
      </h1>
      <div className="flex w-full h-full border border-gray-300 rounded-md gap-4">
        <div className="flex-1/3 flex flex-col items-center border-r border-gray-400 p-4">
          <div className="">
            {user?.usersBusiness.profilePic ? (
              <Image
                src={user?.usersBusiness?.profilePic}
                alt="user Profile picture"
                width={800}
                height={800}
                className="w-80 h-80 rounded-md"
              />
            ) : (
              <User2 size={250} className="stroke-[0.3] stroke-gray-500" />
            )}
          </div>
          <div className="w-full p-4 flex flex-col gap-2 bg-gray-100 mt-4">
            <Input
              type="file"
              placeholder="upload a photo"
              accept="image/*"
              className=""
              onChange={(e) => setNewImage(e.target?.files?.[0])}
            />
            <Button
              disabled={imageUploading}
              className={cn(
                "w-fit self-end bg-indigo-500 hover:bg-indigo-600 cursor-pointer",
                imageUploading && "bg-indigo-300"
              )}
              onClick={async () => {
                if (newImage) {
                  setImageUploading(true);
                  const response = await changeProfilePhoto(newImage);
                  if (response.success && response.data) {
                    console.log(response.data);
                    setUser((prevUser) => {
                      if (!prevUser) return prevUser;
                      return {
                        ...prevUser,
                        usersBusiness: {
                          ...prevUser.usersBusiness,
                          profilePic: response.data.profilePic,
                        },
                      };
                    });
                  }
                  setImageUploading(false);
                }
              }}
            >
              {imageUploading ? (
                <>
                  <Loader2 />
                  Saving
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </div>
          <div className="w-full mt-12">
            <div className="flex flex-col gap-1 mt-2">
              <label
                htmlFor="oldPassword"
                className="font-md text-gray-800 ml-2"
              >
                Old Password
              </label>
              <Input
                type="password"
                className="p-2"
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label
                htmlFor="newPassword"
                className={cn(
                  "font-md text-gray-800 ml-2",
                  passwordError?.isError && "text-red-500"
                )}
              >
                New Password
              </label>
              <Input
                type="password"
                className={`p-2 ${passwordError?.isError && "outline-1 outline-red-500 text-red-500"}`}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError?.isError && e.target.value.length >= 8) {
                    setPasswordError({ isError: false, message: "" });
                  }
                }}
              />
              {passwordError?.isError && (
                <p className="text-sm text-red-500">{passwordError.message}</p>
              )}
            </div>
            <Button
              variant={"outline"}
              className="mt-8 text-lg text-gray-800 w-full text-center py-5"
              onClick={async () => {
                if (oldPassword && newPassword) {
                  if (newPassword.length < 8) {
                    setPasswordError({
                      isError: true,
                      message: "Password must contain atleast 8 chars",
                    });
                  } else {
                    const response = await changePassword(
                      oldPassword,
                      newPassword
                    );
                    console.log(response);
                    if (response?.success) {
                      signOut();
                    }
                  }
                }
              }}
            >
              Change Password
            </Button>
          </div>
        </div>
        <div className="flex-2/3 py-4 pr-4">
          <UserProfileInfo user={user} setUser={setUser} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
