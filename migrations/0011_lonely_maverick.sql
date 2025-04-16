ALTER TABLE "users" DROP CONSTRAINT "users_phone_unique";--> statement-breakpoint
ALTER TABLE "user_business" ADD COLUMN "business_name" text;--> statement-breakpoint
ALTER TABLE "user_business" ADD COLUMN "profile_pic" text;--> statement-breakpoint
ALTER TABLE "user_business" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_business" ADD COLUMN "currency" varchar DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "business_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profile_pic";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "user_business" ADD CONSTRAINT "user_business_phone_unique" UNIQUE("phone");