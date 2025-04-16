CREATE TABLE "invoice_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" text NOT NULL,
	"quantity" integer DEFAULT 0,
	"unit_price" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices" RENAME COLUMN "total_amount" TO "total";--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "tax_percentage" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "tax_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "invoice_details" ADD CONSTRAINT "invoice_details_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;