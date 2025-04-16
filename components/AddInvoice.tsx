"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import BackButton from "./BackButton";
import { CalendarIcon, Save, Trash2 } from "lucide-react";
import { GetClient } from "@/database/schema";
import Link from "next/link";
import StripeTemplate from "./templates/StripeTemplate";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { GetUserWithBusiness } from "@/lib/types";

export const formSchema = z.object({
  client: z.string(),
  total: z.number(),
  invoiceItems: z.array(
    z.object({
      description: z.string(),
      unitPrice: z.number(),
      quantity: z.number(),
      subTotal: z.number(),
    })
  ),
  taxPercentage: z.number(),
  taxAmount: z.number(),
  dueDate: z.date(),
  notes: z.string(),
  totalBeforeTax: z.number(),
});

const AddInvoice = () => {
  const calculateSubTotal = (item: {
    unitPrice: number;
    description?: string;
    quantity: number;
    subTotal?: number;
    id?: string;
  }) => {
    return (item.unitPrice || 0) * (item.quantity || 0);
  };

  const [clients, setClients] = useState<GetClient[] | null>(null);
  const [selectedClient, setSelectedClient] = useState<GetClient>();
  const [date, setDate] = React.useState<Date>();
  const [userData, setUserData] = useState<GetUserWithBusiness>();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();

      formData.append("clientId", values.client);
      formData.append("total", values.total.toString());
      formData.append("notes", values.notes);
      formData.append("taxPercentage", values.taxPercentage.toString());
      formData.append("taxAmount", values.taxAmount.toString());
      formData.append("dueDate", date?.toISOString() as string);

      const response = await fetch("/api/invoices", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          for (const item of values.invoiceItems) {
            const formData = new FormData();

            formData.append("description", item.description);
            formData.append("unitPrice", item.unitPrice.toString());
            formData.append("quantity", item.quantity.toString());
            formData.append("subTotal", item.subTotal.toString());

            console.log(result.data);

            const response = await fetch(
              `/api/invoices/${result.data[0].id}/invoice-item`,
              {
                method: "POST",
                body: formData,
              }
            );

            if (response.ok) {
              const result = await response.json();
              if (result.success) {
                window.alert("Successfull added invoice");
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  function OnChangeForTaxAmount() {
    const currentTaxPercentage = form.getValues("taxPercentage") || 0;
    const currentInvoiceItems = form.getValues("invoiceItems");
    const totalAmount = currentInvoiceItems.reduce(
      (accumulator, currentItem) => {
        return accumulator + (currentItem.subTotal || 0); // Add currentItem.subTotal to the accumulator
      },
      0
    ); // Initialize accumulator to 0
    form.setValue(
      "taxAmount",
      parseFloat((totalAmount * (0.01 * currentTaxPercentage)).toFixed(2))
    );
    form.setValue("totalBeforeTax", totalAmount);
  }

  function onChangeForTotalAmount() {
    const currentTaxAmount = form.getValues("taxAmount");
    const currentInvoiceItems = form.getValues("invoiceItems");
    const subTotalAmount = currentInvoiceItems.reduce(
      (accumulator, currentItem) => {
        return accumulator + (currentItem.subTotal || 0); // Add currentItem.subTotal to the accumulator
      },
      0
    );
    console.log(`subTotalAmount: ${subTotalAmount}`);
    console.log(`total: ${subTotalAmount + currentTaxAmount}`);
    form.setValue(
      "total",
      parseFloat((subTotalAmount + currentTaxAmount).toFixed(2))
    );
    form.setValue("totalBeforeTax", subTotalAmount);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: clients?.[0].id,
      total: 0,
      invoiceItems: [
        { description: "", unitPrice: 0, quantity: 1, subTotal: 0 },
      ],
      notes: "",
      taxPercentage: 0,
      dueDate: new Date(),
      taxAmount: 0,
      totalBeforeTax: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "invoiceItems",
    control: form.control,
  });

  useEffect(() => {
    async function getClients() {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setClients(result.data);
          form.reset({
            client: result.data[0].id, // ✅ set default value dynamically
            total: 0,
            invoiceItems: [
              { description: "", unitPrice: 0, quantity: 1, subTotal: 0 },
            ],
            notes: "",
            taxPercentage: 0,
            taxAmount: 0,
          });
          setSelectedClient(result.data[0]);
        }
      }
    }
    getClients();
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (clients && value.client) {
        const client = clients.find((c) => c.id === value.client);
        setSelectedClient(client);
      }
    });

    return () => subscription.unsubscribe();
  }, [clients, form]);

  useEffect(() => {
    async function getData() {
      const response = await fetch("/api/users");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
        } else {
          window.alert("Error fetching user data");
        }
      } else {
        window.alert("Internal Server Error");
      }
    }
    getData();
  }, []);

  return (
    <main className="py-5 pl-2 pr-8 flex-1 flex justify-between">
      <div className="mt-6 max-w-1/2 bg-gray-100">
        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full mb-6"
            >
              <div className="flex justify-between items-center mb-6">
                <BackButton />
                <div className="flex items-center gap-3">
                  <Button className="bg-gray-300 text-gray-900" type="submit">
                    <Save />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-wide bg-linear-to-r from-blue-400 to-purple-400 via-blue-600 text-transparent bg-clip-text mb-4 pb-2">
                Add Invoice
              </h1>

              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem className="mt-2 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Client<span className="text-red-500 -ml-2">*</span>
                    </FormLabel>
                    <FormControl>
                      {clients !== null && clients.length > 0 ? (
                        <select
                          name="client"
                          id="clientId"
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {clients?.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Link
                          href={"/console/clients/add-client"}
                          className="outline outline-gray-600 w-fit p-2 rounded-md"
                        >
                          Add Client +
                        </Link>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="invoiceItems"
                control={form.control}
                render={() => (
                  <FormItem className="mt-3 gap-2">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Invoice Items
                    </FormLabel>
                    <div className="">
                      {fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 mb-2"
                        >
                          <FormField
                            control={form.control}
                            name={`invoiceItems.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="w-1/3">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`invoiceItems.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem className="w-1/6">
                                <FormLabel>Unit Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    min={0}
                                    onChange={(e) => {
                                      const parsedValue = parseFloat(
                                        e.target.value
                                      );
                                      const numericValueToUse = isNaN(
                                        parsedValue
                                      )
                                        ? 0
                                        : parsedValue;
                                      field.onChange(numericValueToUse);
                                      form.setValue(
                                        `invoiceItems.${index}.subTotal`,
                                        calculateSubTotal({
                                          ...item,
                                          unitPrice: parseFloat(e.target.value),
                                        })
                                      );

                                      OnChangeForTaxAmount();
                                      onChangeForTotalAmount();
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`invoiceItems.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="w-1/6">
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    min={1}
                                    onChange={(e) => {
                                      const parsedValue = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      const numericValueToUse = isNaN(
                                        parsedValue
                                      )
                                        ? 0
                                        : parsedValue;
                                      field.onChange(numericValueToUse);

                                      const currentItemValues = form.getValues(
                                        `invoiceItems.${index}`
                                      );
                                      const currentUnitPrice =
                                        currentItemValues?.unitPrice || 0;

                                      form.setValue(
                                        `invoiceItems.${index}.subTotal`,
                                        calculateSubTotal({
                                          unitPrice: currentUnitPrice,
                                          quantity: numericValueToUse,
                                        })
                                      );
                                      OnChangeForTaxAmount();
                                      onChangeForTotalAmount();
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`invoiceItems.${index}.subTotal`}
                            render={({ field }) => (
                              <FormItem className="w-1/6">
                                <FormLabel>Subtotal</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="destructive"
                            size="sm"
                            className="mt-5"
                          >
                            <span>Remove</span>
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant={"default"}
                      className="w-fit bg-indigo-500 hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
                      onClick={() =>
                        append({
                          description: "",
                          unitPrice: 0,
                          quantity: 1,
                          subTotal: 0,
                        })
                      }
                    >
                      Add Item
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="taxPercentage"
                  render={({ field }) => (
                    <FormItem className="mt-3 gap-0">
                      <FormLabel className="text-lg text-gray-700 tracking-wide">
                        Tax (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                          type="number"
                          placeholder="Tax in percentage"
                          {...field}
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value);
                            const numericValueToUse = isNaN(parsedValue)
                              ? 0
                              : parsedValue;
                            field.onChange(numericValueToUse);
                            OnChangeForTaxAmount();
                            onChangeForTotalAmount();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxAmount"
                  render={({ field }) => (
                    <FormItem className="mt-3 gap-0">
                      <FormLabel className="text-lg text-gray-700 tracking-wide">
                        Tax ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                          placeholder="0.00"
                          readOnly
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
                name="total"
                render={({ field }) => (
                  <FormItem className="mt-3 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Total ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        placeholder="0.00"
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={() => (
                  <FormItem className="mt-3 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Due Date
                    </FormLabel>
                    <FormControl>
                      {/* <Input
                        className="w-full focus-visible:border- focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                        placeholder="0.00"
                        readOnly
                        {...field}
                      /> */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="mt-3 gap-0">
                    <FormLabel className="text-lg text-gray-700 tracking-wide">
                      Notes for the client
                    </FormLabel>
                    <FormControl>
                      <textarea
                        name="address"
                        id="address"
                        placeholder="notes..."
                        onChange={(e) => field.onChange(e.target.value)}
                      ></textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
      <div className="mt-6">
        <StripeTemplate
          showPdfGenerateButton={false}
          client={selectedClient as GetClient}
          invoiceValues={form.getValues()}
          dueDate={date as Date}
          user={userData as GetUserWithBusiness}
        />
      </div>
    </main>
  );
};

export default AddInvoice;
