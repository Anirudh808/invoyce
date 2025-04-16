// import SimpleTemplate from "@/components/templates/SimpleTemplate";
// import StripeTemplate from "@/components/templates/StripeTemplate";
import InvoiceTemplateSelector from "@/components/InvoiceTemplateSelector";
import React from "react";

const page = () => {
  return (
    <main className="m-4 w-full h-screen">
      <div className="mb-6">
        <h1 className="text-4xl text-indigo-800 font-bold ">
          Select Invoice Template
        </h1>
      </div>
      <InvoiceTemplateSelector />
    </main>
  );
};

export default page;
