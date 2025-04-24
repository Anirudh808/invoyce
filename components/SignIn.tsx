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
import { signInWithCredentials } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await signInWithCredentials(values);
    if (result.success) {
      redirect("/console");
    }
    console.log(values);
  }

  return (
    <div className="flex w-[50%] rounded-lg shadow-xl max-h-3/5 max-sm:w-[90%] max-sm:flex-col max-sm:h-screen">
      <div className="px-12 flex flex-col gap-4 w-1/2 bg-white py-12 rounded-bl-lg rounded-tl-lg max-sm:w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-6"
          >
            <h1 className="text-4xl font-bold tracking-wide text-center bg-linear-to-r from-blue-400 to-purple-400 via-blue-600 text-transparent bg-clip-text mb-4 pb-2">
              Sign In
            </h1>

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
                <FormItem>
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
            <div className="flex justify-center">
              <Button
                className="uppercase bg-gradient-to-r from-blue-400 to-purple-600 via-purple-400 cursor-pointer active:scale-98 w-full"
                type="submit"
              >
                Sign in
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
                const result = await signIn("google", { redirect: false });
                console.log("Signed in"); // Prevent automatic redirect
                if (result?.error) {
                  console.log(result.error);
                } else {
                  redirect("/onboarding"); // Ensure full redirect after sign-in
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
              className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 via-blue-600 bg-clip-text text-transparent"
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
              className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 via-blue-600 bg-clip-text text-transparent"
            />
          </Button>
        </div>
      </div>
      <div className="w-[50%] bg-gradient-to-br from-blue-400 to-purple-400 rounded-br-lg rounded-tr-lg flex flex-col items-center justify-center px-4 gap-4 max-sm:w-full max-sm:py-12 max-sm:rounded-bl-lg max-sm:rounded-tr-none">
        <h2 className="text-white text-3xl text-center tracking-wide font-bold">
          Hello, Friend!
        </h2>
        <p className="text-center text-white tracking-normal">
          New to{" "}
          <span className="font-semibold  bg-purple-900 text-transparent bg-clip-text">
            Invoyce
          </span>
          , don&apos;t worry Signup for an account.
        </p>
        <Link
          href={"/signup"}
          className="border-white border px-8 text-white tracking-wide font-light uppercase  text-lg rounded-2xl cursor-pointer mt-6"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
