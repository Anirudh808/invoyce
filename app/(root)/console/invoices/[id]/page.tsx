import InvoiceView from "@/components/InvoiceView";

// ✅ This is a Server Component
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex-1 w-full p-2 pt-6">
      <InvoiceView id={id} />
    </div>
  );
}
