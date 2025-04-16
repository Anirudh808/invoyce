"use client";

import { GetClientWithInvoices } from "@/lib/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { cn } from "@/lib/utils";
import { changeProfilePhoto } from "@/lib/actions/updateUser";
import { Loader2, Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { updateClient } from "@/lib/actions/updateClient";
import { columns, DataTable } from "@/app/(root)/console/invoices/Table";
import Link from "next/link";
import { updateInvoice } from "@/lib/actions/updateInvoice";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  companyName: z.string(),
  phone: z.string(),
  address: z.string(),
});

const ClientProfile = ({ id }: { id: string }) => {
  const [client, setClient] = useState<GetClientWithInvoices>();
  const [newImage, setNewImage] = useState<File>();
  const [imageUploading, setImageUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      companyName: client?.companyName || "",
      phone: client?.phone || "",
      address: client?.address || "",
    },
  });

  useEffect(() => {
    async function getClient() {
      const response = await fetch(`/api/clients/${id}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setClient(result.data);
        }
      }
    }
    getClient();
  }, [id]);

  useEffect(() => {
    if (client) {
      form.reset({
        name: client?.name || "",
        email: client?.email || "",
        companyName: client?.companyName || "",
        phone: client?.phone || "",
        address: client?.address || "",
      });
    }
  }, [client, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dirtyFields = form.formState.dirtyFields;
    console.log("form submitted");
    // Extract only changed values
    const changedValues = Object.keys(dirtyFields).reduce(
      (acc, key) => {
        const typedKey = key as keyof typeof values;
        acc[typedKey] = values[key as keyof typeof values];
        return acc;
      },
      {} as Partial<typeof values>
    );

    console.log("Changed Fields:", changedValues);

    const response = await updateClient(changedValues, client?.id || "");
    if (response.success) {
      console.log(response.data);
      setClient((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          ...response.data?.[0],
        };
      });
    }
  }

  const updateStatus = async (item: string, id: string) => {
    const response = await updateInvoice(
      item as "pending" | "paid" | "overdue",
      id
    );

    if (response.success) {
      console.log(response.data);
      setClient((prevClient) => {
        if (!prevClient) return prevClient;

        return {
          ...prevClient,
          invoices: prevClient.invoices.map((invoice) =>
            invoice.id === id
              ? { ...invoice, status: response.data?.status || "pending" }
              : invoice
          ),
        };
      });
    }
  };

  if (!client) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="m-4 mt-5 text-4xl text-indigo-800 font-bold tracking-wide">
        Client Details
      </h1>
      <div className="flex gap-6 p-8 py-10">
        <div className="flex-1/3">
          <div>
            <div className="flex items-end gap-4">
              <Image
                src={client.profilePic as string}
                alt="client photo"
                width={700}
                height={700}
                className="rounded-md max-w-1/2"
              />
              <div className="max-w-4/5 p-4 flex flex-col gap-2 mt-4">
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
                    "w-full self-end bg-indigo-500 hover:bg-indigo-600 cursor-pointer",
                    imageUploading && "bg-indigo-300"
                  )}
                  onClick={async () => {
                    if (newImage) {
                      setImageUploading(true);
                      const response = await changeProfilePhoto(newImage);
                      if (response.success && response.data) {
                        console.log(response.data);
                        setClient((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            profilePic: response.data.profilePic,
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
                      Uploading..
                    </>
                  ) : (
                    <>Upload</>
                  )}
                </Button>
              </div>
            </div>
            <div className="max-w-4/5 mt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Name */}
                  <div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mt-2 gap-0">
                          <FormLabel className="text-lg text-gray-700 tracking-wide">
                            Name
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
                  </div>

                  {/* Email */}
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mt-2 gap-0">
                          <FormLabel className="text-lg text-gray-700 tracking-wide">
                            Email
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
                  </div>

                  {/* Company */}
                  <div>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="mt-2 gap-0">
                          <FormLabel className="text-lg text-gray-700 tracking-wide">
                            Company
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Company Name"
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

                  {/* Phone */}
                  <div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="mt-2 gap-0">
                          <FormLabel className="text-lg text-gray-700 tracking-wide">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="phone"
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

                  {/* address */}
                  <div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mt-3 gap-0">
                          <FormLabel className="text-lg text-gray-700 tracking-wide">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              name="address"
                              id="address"
                              placeholder="Client Address..."
                              value={client?.address || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <Button
                      type="submit"
                      className="bg-indigo-500 hover:bg-indigo-700 cursor-pointer "
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="flex-2/3">
          <div className="flex justify-end">
            <Link
              href={"/console/clients/add-client"}
              className="flex gap-1 items-center text-indigo-800 p-3 bg-indigo-100 rounded-lg hover:bg-indigo-400 hover:text-white transition-colors duration-200 active:scale-99 w-fit"
            >
              <Plus size={20} /> Create Invoice
            </Link>
          </div>
          <DataTable
            columns={columns({ showClient: false, onUpdate: updateStatus })}
            data={client.invoices}
            showFilter={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
