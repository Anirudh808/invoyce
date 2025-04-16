ALTER TABLE "invoices" ALTER COLUMN "invoice_template_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoice_template_id" DROP NOT NULL;