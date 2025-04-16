import React from "react";

interface Props {
  description: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  default: boolean;
}

const InvoiceItems = (props: Props) => {
  if (props.default) {
    return (
      <>
        <div className="bg-gray-300 h-[2px] w-full mt-2" />
        <div className="grid grid-cols-12 py-1">
          <p className="col-span-6 text-gray-700">{"Services and products"}</p>
          <p className="col-span-2 text-right text-gray-700">{"1"}</p>
          <p className="col-span-2 text-right text-gray-700">{"100.00"}</p>
          <p className="col-span-2 text-right text-gray-700">{"100.00"}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="bg-gray-300 h-[2px] w-full mt-2" />
      <div className="grid grid-cols-12 py-1">
        <p className="col-span-6 text-gray-700">{props.description}</p>
        <p className="col-span-2 text-right text-gray-700">{props.quantity}</p>
        <p className="col-span-2 text-right text-gray-700">{props.unitPrice}</p>
        <p className="col-span-2 text-right text-gray-700">{props.subTotal}</p>
      </div>
    </>
  );
};

export default InvoiceItems;
