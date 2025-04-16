import { cn } from "@/lib/utils";
import React from "react";

const InvoiceStatusCard = ({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("p-3 border rounded-md shadow-md", className)}>
      <h3 className="text-lg text-gray-700 mb-4">{title}</h3>
      <div className="text-xl font-semibold text-gray-700">{children}</div>
    </div>
  );
};

export default InvoiceStatusCard;
