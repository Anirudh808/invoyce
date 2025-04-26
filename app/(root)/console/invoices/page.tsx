"use client"; // 👈 Add this line

import { useEffect, useState } from "react";
import { columns, DataTable } from "./Table";
import Link from "next/link";
import { Plus } from "lucide-react";
import Loader from "@/components/Loader";
import { updateInvoice } from "@/lib/actions/updateInvoice";
import { GetInvoicesWithClient } from "@/lib/types";

const Page = () => {
  const [data, setData] = useState<GetInvoicesWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        console.log(`Fetching data from API...`);
        const res = await fetch("/api/invoices", {
          cache: "no-store",
        });
        const response = await res.json();

        if (response.success) {
          console.log(`Received data:`, response.data);
          setData(response.data);
        } else {
          console.error("Error while fetching clients");
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const updateStatus = async (item: string, id: string) => {
    const response = await updateInvoice(
      item as "pending" | "paid" | "overdue",
      id
    );

    if (response.success) {
      console.log(response.data);
      setData((prev) => {
        if (!prev) return prev;
        const updated = [
          ...prev.map((invoice) =>
            invoice.id === id
              ? { ...invoice, status: response.data?.status || "pending" }
              : invoice
          ),
        ];
        return updated;
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl text-indigo-800 font-bold tracking-wide">
            Invoices
          </h1>
          <p className="text-md text-gray-500 tracking-normal leading-4 mt-2">
            See all your invoice list here
          </p>
        </div>
        <Link
          href={"/console/invoices/add"}
          className="flex gap-1 items-center text-indigo-800 p-3 bg-indigo-100 rounded-lg hover:bg-indigo-400 hover:text-white transition-colors duration-200 active:scale-99"
        >
          <Plus size={20} /> Create Invoice
        </Link>
      </div>
      <DataTable
        columns={columns({ showClient: true, onUpdate: updateStatus })}
        data={data}
      />
    </div>
  );
};

export default Page;
