CREATE TABLE "user_business" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"door_no" integer,
	"street" text,
	"city" text,
	"state" text,
	"country" text,
	"zipcode" text,
	"businessUrl" text
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_logo" text;--> statement-breakpoint
ALTER TABLE "user_business" ADD CONSTRAINT "user_business_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;