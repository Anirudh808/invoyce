"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  profilePic: z
    .custom<File>((file) => file instanceof File, "Must be a file")
    .refine(
      (file) => file.type.startsWith("image/"),
      "Only image files are allowed"
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be ≤ 5MB"),
  companyName: z.string(),
  phone: z.string(),
  address: z.string(),
});

const AddClient = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      profilePic: undefined,
      companyName: "",
      phone: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("profilePic", values.profilePic);
    formData.append("companyName", values.companyName);
    formData.append("phone", values.phone);
    formData.append("address", values.address);

    const response = await fetch("/api/clients", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      window.alert("Successfully created client");
    } else {
      window.alert("Failed to create client.");
    }

    // console.log("Response:", await result.json());
  }

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mb-6">
          <h1 className="text-4xl font-bold tracking-wide bg-linear-to-r from-blue-400 to-purple-400 via-blue-600 text-transparent bg-clip-text mb-4 pb-2">
            Add Client
          </h1>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2 gap-0">
                <FormLabel className="text-lg text-gray-700 tracking-wide">
                  Name<span className="text-red-500 -ml-2">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="name"
                    className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                    required
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
              <FormItem className="mt-3 gap-0">
                <FormLabel className="text-lg text-gray-700 tracking-wide">
                  Email<span className="text-red-500 -ml-2">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="email"
                    className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="mt-3 gap-0">
                <FormLabel className="text-lg text-gray-700 tracking-wide">
                  Company<span className="text-red-500 -ml-2">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                    required
                    placeholder="Company"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mt-3 gap-0">
                <FormLabel className="text-lg text-gray-700 tracking-wide">
                  Phone
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                    placeholder="+91 9876543210"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="mt-3 gap-0">
                <FormLabel className="text-lg text-gray-700 tracking-wide">
                  Address
                </FormLabel>
                <FormControl>
                  <textarea
                    name="address"
                    id="address"
                    placeholder="Client Address..."
                    onChange={(e) => field.onChange(e.target.value)}
                  ></textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profilePic"
            render={({ field: { onChange, onBlur, ref, name } }) => (
              <FormItem className="mt-3 gap-0">
                <FormLabel className="text-lg text-gray-700 tracking-wide">
                  Profile Image
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                    type="file"
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        onChange(file); // ✅ Manually update file
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center mt-8 max-w-1/4">
            <Button
              className="uppercase bg-indigo-400 cursor-pointer active:scale-98 w-full text-gray-50 text-lg tracking-wide hover:bg-indigo-700"
              type="submit"
            >
              Add Client
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddClient;
