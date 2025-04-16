"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const InvoiceTemplateSelector = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(1);

  return (
    <div className="grid grid-cols-9 w-full">
      <div className="col-span-1">
        <div className="bg-gray-100 flex flex-col items-center gap-6 h-screen py-8">
          <div
            onClick={() => setSelectedTemplate(1)}
            className={`${selectedTemplate === 1 && "border-2 border-indigo-300 rounded-md p-2"} cursor-pointer`}
          >
            <Image
              src={"/generated_invoice-1.png"}
              alt="stripe invoice template"
              height={300}
              width={120}
            />
          </div>
          <div
            onClick={() => setSelectedTemplate(2)}
            className={`${selectedTemplate === 2 && "border-2 border-indigo-300 rounded-md p-2"} cursor-pointer`}
          >
            <Image
              src={"/simple-pdf-1.png"}
              alt="stripe invoice template"
              height={300}
              width={120}
            />
          </div>
        </div>
      </div>
      <div className="col-span-7 ml-48">
        <div>
          <Image
            src={
              selectedTemplate === 1
                ? "/generated_invoice-1.png"
                : "/simple-pdf-1.png"
            }
            alt="invoice template"
            width={900}
            height={2000}
            className="w-[600px] h-[850px]"
          />
        </div>
      </div>
      <div>
        <Link
          href={`/console/invoices/add/${selectedTemplate}`}
          className="p-3 bg-indigo-500 text-white tracking-wide rounded-lg text-lg hover:bg-indigo-700 cursor-pointer transition-colors duration-200"
        >
          Select Template
        </Link>
      </div>
    </div>
  );
};

export default InvoiceTemplateSelector;
