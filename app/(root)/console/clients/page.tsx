"use client"; // 👈 Add this line

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./Table";
import Link from "next/link";
import { Plus } from "lucide-react";
import Loader from "@/components/Loader";
import { GetClient } from "@/database/schema";

const Page = () => {
  const [data, setData] = useState<GetClient[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        console.log(`Fetching data from API...`);
        const res = await fetch("/api/clients", {
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

  async function deleteClient(id: string) {
    const response = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.success) {
      const tempData = data?.filter((item) => item.id !== id);
      setData(tempData);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4x text-indigo-800 font-bold tracking-wide ">
            Clients
          </h1>
          <p className="text-md text-gray-500 tracking-normal leading-4 mt-2">
            See all your clients list here
          </p>
        </div>
        <Link
          href={"/console/clients/add-client"}
          className="flex gap-1 items-center text-indigo-800 p-3 bg-indigo-100 rounded-lg hover:bg-indigo-400 hover:text-white transition-colors duration-200 active:scale-99"
        >
          <Plus size={20} /> Add Client
        </Link>
      </div>
      <DataTable columns={columns(deleteClient)} data={data as GetClient[]} />
    </div>
  );
};

export default Page;
