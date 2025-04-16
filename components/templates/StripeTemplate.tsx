"use client";

import React from "react";
import InvoiceItems from "../InvoiceItems";
import { Globe, Mail, PhoneCall } from "lucide-react";
import { Button } from "../ui/button";
// import { generatePDF } from "@/lib/helpers";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { GetClient } from "@/database/schema";
import { z } from "zod";
import { formSchema } from "../AddInvoice";
import { formatUSD } from "@/lib/utils";
import { GetUserWithBusiness } from "@/lib/types";

type Props = {
  showPdfGenerateButton: boolean;
  client?: GetClient;
  invoiceValues?: z.infer<typeof formSchema>;
  dueDate?: Date;
  user?: GetUserWithBusiness;
};

const StripeTemplate = (props: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      {props.showPdfGenerateButton && (
        <Button variant={"outline"} onClick={() => reactToPrintFn()}>
          Generate PDF
        </Button>
      )}
      <div
        ref={contentRef}
        className="p-8 max-w-[210mm] max-h-[297mm] min-w-[190mm] min-h-[90vh] mx-auto  border border-gray-300 rounded flex flex-col justify-between"
        id="stripeTemplate"
      >
        <div>
          {/* header */}
          <div className="flex justify-between items-start mb-12">
            <div></div>
            <div>
              <h2 className="text-3xl text-gray-700">
                <span className="text-4xl">Invoice</span>{" "}
                <span>{"<Inovice Number>"}</span>
              </h2>
              <p className="text-right mr-2 text-gray-700 text-lg">
                Tax invoice
              </p>
            </div>
          </div>

          {/* top details */}
          <div className="flex justify-between items-start">
            <div className="">
              <h3 className="text-lg font-bold">Bill to</h3>
              {props.client ? (
                <div className="flex flex-col">
                  <p>{props.client.name}</p>
                  <p>{props.client.email}</p>
                  <p>{props.client.address}</p>
                </div>
              ) : (
                <>
                  <p>Your Client</p>
                  <p>Client Address</p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2 font-semibold">
              <div className="flex justify-between w-72">
                <p>Issue date:</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between w-72">
                <p>Due date:</p>
                {props.dueDate ? (
                  <p>{props.dueDate.toLocaleDateString()}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-between w-72">
                <p>Invoice Number:</p>
                <p>2025132</p>
              </div>
            </div>
          </div>

          {/* invoice overview */}
          <div className="flex items-center gap-1 w-full mt-6 text-white">
            <div className="w-[22%] bg-[#FDC254] p-3 py-5">
              <p className="text-lg">Invoice No.</p>
              <p className="text-2xl">2025164</p>
            </div>
            <div className="w-[22%] bg-[#FDC254] p-3 py-5">
              <p className="text-lg">Issue Date.</p>
              <p className="text-2xl">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="w-[22%] bg-[#FDC254] p-3 py-5">
              <p className="text-lg">Due Date</p>
              {props.dueDate ? (
                <p className="text-2xl">{props.dueDate.toLocaleDateString()}</p>
              ) : (
                <p className="text-xl">{"<Due Date>"}</p>
              )}
            </div>
            <div className="w-[33%] bg-gray-500 p-3 py-5">
              <p className="text-lg">Total Due (USD)</p>
              <p className="text-2xl">$2,500.00</p>
            </div>
          </div>

          {/* invoice items */}
          <div className="mt-6">
            <div className="grid grid-cols-12">
              <h3 className="col-span-6 font-semibold tracking-tight">
                Description
              </h3>
              <h3 className="col-span-2 text-right font-semibold tracking-tight">
                Quantity
              </h3>
              <h3 className="col-span-2 text-right font-semibold tracking-tight">
                Unit price ($)
              </h3>
              <h3 className="col-span-2 text-right font-semibold tracking-tight">
                Amount ($)
              </h3>
            </div>
            {props.invoiceValues &&
              props.invoiceValues?.invoiceItems.length > 0 &&
              props.invoiceValues?.invoiceItems.map((item, index) => (
                <InvoiceItems
                  key={index}
                  description={item.description}
                  quantity={item.quantity}
                  unitPrice={item.unitPrice}
                  subTotal={item.subTotal}
                  default={props.showPdfGenerateButton}
                />
              ))}
            <div className="bg-gray-300 h-[2px] w-full" />
            <div className="flex justify-between items-center mt-1">
              <h3>Subtotal:</h3>
              <p>{formatUSD(props.invoiceValues?.totalBeforeTax || 0)}</p>
            </div>
            <TaxDetails amount={props.invoiceValues?.taxAmount || 0} />
            <div className="flex items-center justify-between mt-1">
              <h3>Total:</h3>
              <p>{formatUSD(props.invoiceValues?.total || 0)}</p>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-4">
            <p className="text-right font-bold">Issued by, signature:</p>
          </div>
        </div>
        {/* footer */}
        <footer>
          <div className="flex justify-between items-center px-1">
            <p className="flex gap-1 items-center">
              <PhoneCall size={14} />
              <span className="text-sm tracking-tight">
                {props.user?.usersBusiness.phone || "+91 9362598742"}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              <Globe size={14} />
              <span className="text-sm tracking-tight">
                {props.user?.usersBusiness.businessUrl ||
                  "www.anirudhmounasamy.dev"}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              <Mail size={14} />
              <span className="text-sm tracking-tight">
                {props.user?.email || "anirudhmounasamy@gmail.com"}
              </span>
            </p>
          </div>
          <div className="bg-gray-400 h-[2px] w-full" />
          <div>
            <p className="text-sm">{props.user?.name || "Your Business"}</p>
            {props.user?.usersBusiness ? (
              <div className="text-sm">
                <p>
                  {props.user.usersBusiness.doorNo},{" "}
                  {props.user.usersBusiness.street},
                </p>
                <p>
                  {props.user.usersBusiness.city} -{" "}
                  {props.user.usersBusiness.zipcode},
                </p>
                <p>{props.user.usersBusiness.country}</p>
              </div>
            ) : (
              <p className="-mt-0.5 text-sm">Your Address</p>
            )}
          </div>
        </footer>
      </div>
    </>
  );
};

function TaxDetails({ amount }: { amount: number }) {
  return (
    <div className="flex justify-between items-center text-sm mt-1 pl-1">
      <h3>Tax</h3>
      <p>{formatUSD(amount || 0)}</p>
    </div>
  );
}

export default StripeTemplate;
