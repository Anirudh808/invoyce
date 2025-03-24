"use client";

import { signUp } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

function SignIn() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signUp(formData);
    console.log(result);
  };
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Your Name.."
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Your Email.."
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button type="submit">Sign Up</button>
      </form>
      <button
        onClick={async () => await signIn("google")}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Sign Up with Google
      </button>
    </div>
  );
}

export default SignIn;
