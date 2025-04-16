"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Trash2, User2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetClient } from "@/database/schema";
import Image from "next/image";
import { generateRandomColorClasses } from "@/lib/helpers";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = (
  deleteClient: (id: string) => void
): ColumnDef<GetClient>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const className = generateRandomColorClasses();
      return (
        <div className="flex gap-2 items-center">
          {row.original.profilePic ? (
            <Image
              src={row.original.profilePic}
              alt=""
              width={50}
              height={50}
              className="rounded-full w-12 h-12"
            />
          ) : (
            <div className={`${className} rounded-full p-1`}>
              <User2 size={40} />
            </div>
          )}{" "}
          <span className="text-md ml-2">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="pl-3">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`/console/clients/${row.original.id}`}
                className="flex items-center gap-1"
              >
                <Eye />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                deleteClient(row.original.id);
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
