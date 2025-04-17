import ClientProfile from "@/components/ClientProfile";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const id = param.id;
  return (
    <main className="w-full">
      <ClientProfile id={id} />
    </main>
  );
}
