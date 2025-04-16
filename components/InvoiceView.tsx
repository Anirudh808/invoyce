"use client";

import React, { useEffect, useState } from "react";
import { GetSingleInvoice, GetUserWithBusiness } from "@/lib/types";
import StripeTemplatePreview from "./templates/StripeTemplatePreview";
import BackButton from "./BackButton";

const InvoiceView = ({ id }: { id: string }) => {
  const [invoice, setInvoice] = useState<GetSingleInvoice>();
  const [userData, setUserData] = useState<GetUserWithBusiness>();

  useEffect(() => {
    async function getData() {
      const response = await fetch(`/api/invoices/${id}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(result.data);
          setInvoice(result.data);
        }
      }
    }
    getData();
  }, [id]);

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
    <div className="h-screen overflow-y-auto flex gap-32">
      <BackButton />
      <div className="">
        {invoice && userData ? (
          <StripeTemplatePreview
            showPdfGenerateButton={true}
            client={invoice.client}
            invoiceValues={invoice}
            dueDate={invoice.dueDate as Date}
            user={userData}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceView;
