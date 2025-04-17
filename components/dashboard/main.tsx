"use client";

import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import { GetInvoicesWithClient, GetUserWithBusiness } from "@/lib/types";
import InvoiceStatusCard from "./InvoiceStatusCard";
import { formatUSD } from "@/lib/utils";
import { Component } from "../Chart";
import { columns, DataTable } from "@/app/(root)/console/invoices/Table";
// import AreaChart from "./AreaChart";

const DashboardMain = () => {
  const [user, setUser] = useState<GetUserWithBusiness>();
  const [invoices, setInvoices] = useState<GetInvoicesWithClient[]>();
  const [chartData, setChartData] =
    useState<Array<{ month: string; amount: number }>>();
  const [monthRange, setMonthRange] = useState(6);

  useEffect(() => {
    async function getData() {
      const response = await fetch("/api/users");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser(result.data);
        } else {
          window.alert("Error fetching user data");
        }
      } else {
        window.alert("Internal Server Error");
      }
    }
    getData();
  }, []);

  useEffect(() => {
    async function getInvoices() {
      const response = await fetch("/api/invoices");
      if (response.ok) {
        const result = await response.json();
        setInvoices(result.data);
      }
    }
    getInvoices();
  }, []);

  useEffect(() => {
    if (invoices && invoices?.length > 0) {
      const monthRangeAgo = new Date();
      monthRangeAgo.setMonth(monthRangeAgo.getMonth() - monthRange);

      const monthMap = new Map();

      invoices.forEach((invoice) => {
        const date = new Date(invoice.dueDate);

        // Only consider paid invoices within the last 6 months
        if (invoice.status === "paid" && date >= monthRangeAgo) {
          const monthName = date.toLocaleString("default", { month: "long" });
          const year = date.getFullYear();
          const key = `${monthName}-${year}`;

          const totalAmount = parseFloat(invoice.total) || 0;

          if (monthMap.has(key)) {
            monthMap.set(key, monthMap.get(key) + totalAmount);
          } else {
            monthMap.set(key, totalAmount);
          }
        }
      });

      // Convert to array and sort by date
      const result = Array.from(monthMap.entries())
        .map(([monthYear, amount]) => {
          const [monthName, year] = monthYear.split("-");
          return {
            month: monthName,
            year: parseInt(year),
            amount,
            date: new Date(`${monthName} 1, ${year}`), // used only for sorting
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(({ month, year, amount }) => ({
          month: `${month} ${year}`,
          amount,
        }));

      setChartData(result);
    }
  }, [invoices, monthRange]);

  let totalInvoices: number = 0;
  let totalAmount: number = 0;
  let pendingInvoices: number = 0;
  let pendingAmount: number = 0;
  let paidInvoices: number = 0;
  let paidAmount: number = 0;

  if (invoices !== undefined && invoices?.length > 0) {
    invoices.map((invoice) => {
      totalInvoices += 1;
      totalAmount += Number(invoice.total);
      if (invoice.status === "pending") {
        pendingInvoices += 1;
        pendingAmount += Number(invoice.total);
      } else if (invoice.status === "paid") {
        paidInvoices += 1;
        paidAmount += Number(invoice.total);
      }
    });
  }

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="p-4 max-h-screen">
      <div>
        <h1 className="text-4xl text-indigo-800 font-bold tracking-wide ">
          Dashboard
        </h1>
        <p className="text-md text-gray-500 tracking-normal leading-4 mt-2">
          See all your invoice summary and payments here
        </p>
      </div>
      <div className="mt-3 p-6 border border-gray-200 rounded-md w-full">
        <h2 className="text-3xl tracking-wide font-bold text-indigo-800">
          Welcome back, {user.name} 👋
        </h2>
        <p className="text-md text-gray-400">
          Glad to see you again to Invoyce, ready to manage invoices
        </p>
      </div>
      <div className="grid grid-cols-3 gap-x-6 mt-3">
        <InvoiceStatusCard
          title="Total Invoices"
          className="border border-blue-500 shadow-blue-300 bg-blue-50"
        >
          <div className="flex justify-between">
            <div>
              <p>Total Invoices: {totalInvoices}</p>
              <p>Total Amount: {formatUSD(totalAmount)}</p>
            </div>
          </div>
        </InvoiceStatusCard>
        <InvoiceStatusCard
          title="Pending Invoices"
          className="border border-amber-500 shadow-amber-300 bg-amber-50"
        >
          <div className="flex justify-between">
            <div>
              <p>Pending Invoices: {pendingInvoices}</p>
              <p>Pending Amount: {formatUSD(pendingAmount)}</p>
            </div>
          </div>
        </InvoiceStatusCard>

        <InvoiceStatusCard
          title="Paid Invoices"
          className="border border-emerald-500 shadow-emerald-300 bg-emerald-50"
        >
          <div className="flex justify-between">
            <div>
              <p>Paid Invoices: {paidInvoices}</p>
              <p>Paid Amount: {formatUSD(paidAmount)}</p>
            </div>
          </div>
        </InvoiceStatusCard>
      </div>
      <div className="grid grid-cols-2 gap-x-2 mt-3">
        <div>
          <Component
            chartData={
              chartData as {
                month: string;
                amount: number;
              }[]
            }
            onChangeRange={(months: number) => setMonthRange(months)}
          />
        </div>
        <div>
          <DataTable
            columns={columns({ showClient: true })}
            data={
              invoices?.sort(
                (a, b) =>
                  new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
              ) as GetInvoicesWithClient[]
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
