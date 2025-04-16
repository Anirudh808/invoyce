import InvoiceView from "@/components/InvoiceView";

// ✅ This is a Server Component
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="flex-1 w-full p-2 pt-6">
      <InvoiceView id={id} />
    </div>
  );
}
