"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { signUp } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export default function Signup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (values.password === values.confirmPassword) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }

    if (isPasswordMatch) {
      const result = await signUp(values);
      if (result.success) {
        redirect("/onboarding");
      }
      console.log(values);
    }
  }

  useEffect(() => {
    if (isPasswordMatch === false) {
      form.setError("confirmPassword", {
        type: "custom",
        message: "Passwords doesn't match",
      });
    }
  }, [isPasswordMatch, form]);

  return (
    <div className="flex w-[50%] rounded-lg shadow-xl max-h-4/5">
      <div className="w-[50%] bg-gradient-to-br from-blue-400 to-purple-400 rounded-bl-lg rounded-tl-lg flex flex-col items-center justify-center px-4 gap-4">
        <h2 className="text-white text-3xl text-center tracking-wide font-bold">
          Welcome, Back!
        </h2>
        <p className="text-center text-white tracking-normal mx-8">
          If you already have an accoun with{" "}
          <span className="font-semibold  bg-purple-900 text-transparent bg-clip-text">
            Invoyce
          </span>
          , please Signin.
        </p>
        <Button
          className="border-white border px-8 text-white tracking-wide font-light uppercase  text-lg rounded-2xl cursor-pointer mt-6"
          variant="ghost"
        >
          Sign In
        </Button>
      </div>
      <div className="px-12 flex flex-col gap-4 w-1/2 bg-white py-12 rounded-br-lg rounded-tr-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-6"
          >
            <h1 className="text-4xl font-bold tracking-wide text-center bg-linear-to-r from-blue-400 to-purple-400 via-blue-600 text-transparent bg-clip-text mb-4 pb-2">
              Create Account
            </h1>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="m-0">
                  <FormLabel className="text-lg text-gray-700 tracking-wide">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="m-0">
                  <FormLabel className="text-lg text-gray-700 tracking-wide">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="m-0">
                  <FormLabel className="text-lg text-gray-700 tracking-wide">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                      placeholder="password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-700 tracking-wide">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                      placeholder="password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center mt-4">
              <Button
                className="uppercase bg-gradient-to-r from-blue-400 to-purple-400 via-blue-300 cursor-pointer active:scale-98 w-full text-gray-50 text-lg tracking-wider"
                type="submit"
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex items-center justify-center gap-4 -mt-6 cursor-pointer">
          <div className="border border-t border-gray-400 w-1/3"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="border border-t border-gray-400 w-1/3"></div>
        </div>

        <div className="flex justify-center">
          <Button
            variant={"ghost"}
            className="bg-white rounded-full p-5 cursor-pointer"
            onClick={async () => {
              try {
                const result = await signIn("google", { redirect: false }); // Prevent automatic redirect
                if (result?.error) {
                  console.log(result.error);
                } else {
                  window.location.href = "/"; // Ensure full redirect after sign-in
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Image
              src="google.svg"
              alt="Google"
              width={0}
              height={0}
              className="w-8 h-8"
            />
          </Button>
          <Button
            variant={"ghost"}
            className="bg-white rounded-full p-5 cursor-pointer"
            onClick={async () => {
              try {
                const result = await signIn("github", { redirect: false }); // Prevent automatic redirect
                if (result?.error) {
                  console.log(result.error);
                } else {
                  window.location.href = "/"; // Ensure full redirect after sign-in
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Image
              src="github.svg"
              alt="Github"
              width={0}
              height={0}
              className="w-8 h-8"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
