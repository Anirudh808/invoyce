import ClientProfile from "@/components/ClientProfile";
import React, { FC } from "react";

interface ClientPageProps {
  params: {
    id: string;
  };
}

const page: FC<ClientPageProps> = ({ params }) => {
  const { id } = params;
  return (
    <main className="w-full">
      <ClientProfile id={id} />
    </main>
  );
};

export default page;
