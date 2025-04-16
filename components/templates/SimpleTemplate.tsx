"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";

const SimpleTemplate = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <>
      <Button variant={"outline"} onClick={() => reactToPrintFn()}>
        Generate PDF
      </Button>
      <div
        ref={contentRef}
        className="p-8 w-[210mm] h-[297mm] mx-auto  border border-gray-300 rounded flex flex-col pt-24 px-12"
      >
        <div className="flex items-center gap-2">
          <div className="bg-gray-500 h-[2px] w-full"></div>
          <div>
            <h1 className="text-5xl uppercase tracking-widest text-gray-600">
              Invoice
            </h1>
          </div>
        </div>
        <div className="mt-64 flex justify-between items-start">
          <div>
            <h3 className="font-bold mb-1 uppercase tracking-wide">
              Issued to:
            </h3>
            <p className="leading-5 tracking-wide">Client Name</p>
            <p className="leading-5 tracking-wide">Company</p>
            <p className="leading-5 tracking-wide">Address</p>
          </div>
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between w-52 font-semibold">
              <p>Invoice Number:</p>
              <p>2025132</p>
            </div>
            <div className="flex justify-between w-52">
              <p>Issue date:</p>
              <p>1/1/1900</p>
            </div>
            <div className="flex justify-between w-52">
              <p>Due date:</p>
              <p>1/1/1900</p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="uppercase font-bold tracking-wide">Pay to:</h3>
          <p className="leading-5 tracking-wide">Your name</p>
          <p className="leading-5 tracking-wide">Your bank details</p>
          <p className="leading-5 tracking-wide">other payment details</p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-12">
            <h3 className="col-span-6 font-semibold tracking-wide text-sm uppercase">
              Description
            </h3>
            <h3 className="col-span-2 text-right font-semibold tracking-wide text-sm uppercase">
              Unit price ($)
            </h3>
            <h3 className="col-span-2 text-right font-semibold tracking-wide text-sm uppercase">
              Quantity
            </h3>
            <h3 className="col-span-2 text-right font-semibold tracking-wide text-sm uppercase">
              Total ($)
            </h3>
          </div>
          <div className="bg-gray-300 h-[2px] w-full mt-2" />
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 py-1">
              <p className="col-span-6 text-gray-800">Services and products</p>
              <p className="col-span-2 text-right text-gray-800">1</p>
              <p className="col-span-2 text-right text-gray-800">100.00</p>
              <p className="col-span-2 text-right text-gray-800">100.00</p>
            </div>
            <div className="grid grid-cols-12 py-1">
              <p className="col-span-6 text-gray-800">Services and products</p>
              <p className="col-span-2 text-right text-gray-800">1</p>
              <p className="col-span-2 text-right text-gray-800">100.00</p>
              <p className="col-span-2 text-right text-gray-800">100.00</p>
            </div>
          </div>
          <div className="bg-gray-300 h-[2px] w-full" />
          <div className="flex justify-between items-center mt-1">
            <h3>Subtotal:</h3>
            <p>
              <span>$</span>100.00
            </p>
          </div>
          <div className="flex justify-end mt-1">
            <div className="flex justify-between w-24">
              <h4 className="text-gray-700">Tax</h4>
              <p>10%</p>
            </div>
          </div>
          <div className="flex justify-end mt-1">
            <div className="flex justify-between w-[120px]">
              <h4 className="text-gray-700 font-bold tracking-wide uppercase">
                Total
              </h4>
              <p>$220.00</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-right font-bold">Issued by, signature:</p>
        </div>
      </div>
    </>
  );
};

export default SimpleTemplate;
