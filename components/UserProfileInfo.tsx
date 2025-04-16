import React, { SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { GetUserWithBusiness } from "@/lib/types";
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
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { changeBusinessLogo, updateUser } from "@/lib/actions/updateUser";
import { cn } from "@/lib/utils";
import Image from "next/image";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  businessName: z.string(),
  currency: z.string(),
  businessUrl: z.string(),
  doorNo: z.string(),
  street: z.string(),
  phone: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipcode: z.string(),
});

const UserProfileInfo = ({
  user,
  setUser,
}: {
  user: GetUserWithBusiness | undefined;
  setUser: React.Dispatch<SetStateAction<GetUserWithBusiness | undefined>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      businessName: user?.usersBusiness?.businessName || "",
      currency: user?.usersBusiness?.currency || "",
      phone: user?.usersBusiness?.phone || "",
      businessUrl: user?.usersBusiness?.businessUrl || "",
      doorNo: user?.usersBusiness?.doorNo || "",
      street: user?.usersBusiness?.street || "",
      city: user?.usersBusiness?.city || "",
      state: user?.usersBusiness?.state || "",
      country: user?.usersBusiness?.country || "",
      zipcode: user?.usersBusiness?.zipcode || "",
    },
  });

  const [newImage, setNewImage] = useState<File>();
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        businessName: user?.usersBusiness?.businessName || "",
        currency: user?.usersBusiness?.currency || "",
        phone: user?.usersBusiness?.phone || "",
        businessUrl: user?.usersBusiness?.businessUrl || "",
        doorNo: user?.usersBusiness?.doorNo || "",
        street: user?.usersBusiness?.street || "",
        city: user?.usersBusiness?.city || "",
        state: user?.usersBusiness?.state || "",
        country: user?.usersBusiness?.country || "",
        zipcode: user?.usersBusiness?.zipcode || "",
      });
    }
  }, [user, form]);

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
    console.log(typeof user);
    // send changedValues to the API
    const response = await updateUser(changedValues);
    if (response.success) {
      console.log(response.data);
      setUser(response.data);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center">
            <h3 className="text-gray-800 text-xl tracking-wide font-semibold">
              Profile Information
            </h3>
            <Button variant={"outline"} type="submit">
              Save
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
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

            {/* Business Name */}
            <div>
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Business Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="business name"
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

            {/* Currency */}
            <div>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Currency
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="currency"
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

            {/* Business URL */}
            <div>
              <FormField
                control={form.control}
                name="businessUrl"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Business URL
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
          </div>

          <h3 className="text-gray-800 text-xl tracking-wide font-semibold mt-14">
            Business Address
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
            {/* doorNo */}
            <div>
              <FormField
                control={form.control}
                name="doorNo"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Door Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="door number"
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

            {/* street */}
            <div>
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Street
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="street"
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

            {/* city */}
            <div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="city"
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

            {/* doorNo */}
            <div>
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      State
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="state"
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

            {/* doorNo */}
            <div>
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      State
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="state"
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

            {/* country */}
            <div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="country"
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

            {/* zipcode */}
            <div>
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Zipcode
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="zipcode"
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
          </div>
        </form>
      </Form>
      <h3 className="mt-3 text-lg text-gray-700 tracking-wide font-semibold">
        Business Logo
      </h3>
      <div className="flex items-center gap-32 relative">
        <div className="flex gap-3 items-center">
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
                const response = await changeBusinessLogo(newImage);
                if (response.success && response.data) {
                  console.log(response.data);
                  setUser((prevUser) => {
                    if (!prevUser) return prevUser;
                    return {
                      ...prevUser,
                      usersBusiness: {
                        ...prevUser.usersBusiness,
                        businessLogo: response.data.businessLogo,
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
        <div className="pd-6 absolute left-3/5 rounded-md">
          {user?.usersBusiness?.businessLogo && (
            <Image
              src={user?.usersBusiness?.businessLogo || ""}
              alt="business logo"
              width={150}
              height={150}
              className="rounded-md"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
// name, email, businessName, currency, businessUrl
// doorNo, street, city, state, country, zipcode, businessLogo
