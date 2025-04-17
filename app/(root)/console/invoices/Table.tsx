"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CircleCheck,
  CircleDot,
  Eye,
  MoreHorizontal,
  RedoDot,
  Trash2,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { GetClient, GetInvoice } from "@/database/schema";
import Image from "next/image";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { generateRandomColorClasses } from "@/lib/helpers";
import Link from "next/link";

const status = ["pending", "overdue", "paid"];

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = ({
  showClient = true,
  onUpdate,
}: {
  showClient: boolean;
  onUpdate?: (item: string, id: string) => void;
}): ColumnDef<GetInvoice>[] => {
  const baseColumns: (ColumnDef<GetInvoice> | false)[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice Number",
      cell: ({ row }) => {
        return <p>#{row.getValue("invoiceNumber")}</p>;
      },
    },
    showClient && {
      accessorKey: "client",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const className = generateRandomColorClasses();
        const client: GetClient = row.getValue("client") || {};

        return (
          <div className="flex gap-2 items-center">
            {client.profilePic ? (
              <Image
                src={client.profilePic}
                alt=""
                width={50}
                height={50}
                className="rounded-full w-12 h-12"
              />
            ) : (
              <div className={`${className} rounded-full p-1`}>
                <User2 size={40} />
              </div>
            )}
            <span className="text-md ml-2">{client.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <p
            className={`uppercase text-sm rounded-full ml-1 px-2 py-1 w-fit ${
              status === "pending"
                ? "bg-amber-100 border border-amber-400"
                : status === "paid"
                  ? "bg-emerald-100 border border-emerald-400"
                  : "bg-rose-100 border border-rose-400"
            }`}
          >
            {status as string}
          </p>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dueDate: Date = row.getValue("dueDate");
        return <p className="pl-3">{new Date(dueDate).toLocaleDateString()}</p>;
      },
    },
    onUpdate !== undefined && {
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

              <DropdownMenuLabel className="text-xs opacity-70">
                Update Status
              </DropdownMenuLabel>
              {status
                .filter((i) => i !== row.original.status)
                .map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => {
                      onUpdate(item, row.original.id);
                    }}
                  >
                    {" "}
                    <span>
                      {item === "pending" ? (
                        <CircleDot />
                      ) : item === "overdue" ? (
                        <RedoDot />
                      ) : (
                        <CircleCheck />
                      )}
                    </span>
                    Mark as {item}
                  </DropdownMenuItem>
                ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link
                  href={`/console/invoices/${row.original.id}`}
                  className="flex items-center gap-1"
                >
                  <Eye />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
              // onClick={async () => {
              //   deleteClient(row.original.id);
              // }}
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

  // Filter out `false` values before returning
  return baseColumns.filter(Boolean) as ColumnDef<GetInvoice>[];
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showFilter?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showFilter = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        {showFilter && (
          <Input
            placeholder="Filter Clients..."
            value={
              (table.getColumn("client")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("client")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-indigo-200 text-indigo-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${index % 2 !== 0 && "bg-indigo-50"}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
