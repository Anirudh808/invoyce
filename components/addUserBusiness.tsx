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
import { User } from "next-auth";
import { redirect } from "next/navigation";

const fileSchema = z
  .custom<File>((file) => file instanceof File, "Must be a file")
  .refine(
    (file) => file.type.startsWith("image/"),
    "Only image files are allowed"
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be ≤ 5MB");

const formSchema = z.object({
  doorNo: z.string(),
  street: z.string(),
  country: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  businessUrl: z.union([z.string().url(), z.string(), z.null()]),
  businessName: z.string(),
  phone: z.string(),
  currency: z.string(),
  profilePic: z.union([fileSchema, z.null()]).optional(),
  businessLogo: z.union([fileSchema, z.null()]).optional(),
});

const AddUserBusiness = ({ user }: { user: User }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      phone: "",
      currency: "",
      profilePic: null,
      businessLogo: null,
      doorNo: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      businessUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("doorNo", values.doorNo);
    formData.append("street", values.street);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("zipcode", values.zipcode);
    formData.append("country", values.country);
    formData.append("businessUrl", values.businessUrl || "");
    formData.append("profilePic", values.profilePic || "");
    formData.append("businessLogo", values.businessLogo || "");
    formData.append("businessName", values.businessName);
    formData.append("phone", values.phone);
    formData.append("currency", values.currency);

    const response = await fetch("/api/users", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      window.alert("Successfully created client");
      redirect("/console/clients");
    } else {
      window.alert("Failed to create client.");
    }

    // console.log("Response:", await result.json());
  }

  return (
    <div className="flex w-full rounded-lg shadow-xl max-h-3/5">
      <div className="px-12 flex flex-col gap-4 w-[60%] bg-white py-12 rounded-bl-lg rounded-tl-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mb-6">
            <h1 className="text-4xl font-bold tracking-wide bg-linear-to-r from-blue-400 to-purple-400 via-blue-600 text-transparent bg-clip-text mb-4 pb-2 uppercase">
              Add Your Business Details
            </h1>

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem className="mt-2 gap-0">
                  <FormLabel className="text-lg text-gray-700 tracking-wide">
                    Business Name<span className="text-red-500 -ml-2">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Company Name or Self"
                      className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0 flex-4/6">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Phone<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 9345453725"
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
                name="currency"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0 flex-2/6">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Currency<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="USD or EUR"
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="businessLogo"
              render={({ field: { onChange, onBlur, ref, name } }) => (
                <FormItem className="mt-3 gap-0">
                  <FormLabel className="text-lg text-gray-700 tracking-wide">
                    Your Business Logo
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
            <div className="flex gap-4 justify-between">
              <FormField
                control={form.control}
                name="doorNo"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0 flex-2/6">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Door No.<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="4/314A"
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
                name="street"
                render={({ field }) => (
                  <FormItem className="mt-3 gap-0 flex-4/6">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Street<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Anbu Nagar, Bodipatti"
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 justify-between">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="mt-3 gap-0 flex-1/2">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      City<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        required
                        placeholder="Udumalpet"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="mt-3 gap-0 flex-1/2">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      State<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        placeholder="Tamil Nadu"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between gap-4 items-center">
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem className="mt-3 gap-0 flex-1/2">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Zipcode<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        placeholder="642154"
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
                name="country"
                render={({ field }) => (
                  <FormItem className="mt-3 gap-0 flex-1/2">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Country<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        placeholder="India"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="businessUrl"
              render={({ field }) => (
                <FormItem className="mt-3 gap-0">
                  <FormLabel className="text-lg text-gray-700 tracking-wide">
                    Business Url
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                      placeholder="www.yourbusiness.com"
                      {...field}
                      value={field.value || ""}
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="w-[40%] bg-gradient-to-br from-blue-400 to-purple-400 rounded-br-lg rounded-tr-lg flex flex-col items-center justify-center px-4 gap-4">
        <h2 className="text-white text-3xl text-center tracking-wide font-bold">
          Hello, {user.name}!
        </h2>
        <p className="text-center text-white tracking-wide w-[60%]">
          Enter you business details to easily create and manage invoices on{" "}
          <span className="font-semibold  bg-purple-900 text-transparent bg-clip-text">
            Invoyce
          </span>{" "}
        </p>
      </div>
    </div>
  );
};

export default AddUserBusiness;
