CREATE TYPE "public"."roles_enum" AS ENUM('ADMIN', 'MEMBER', 'USER');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflows" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "workflows_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"name" varchar NOT NULL,
	"definition" varchar,
	"status" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "name" SET DATA TYPE roles_enum;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isNew" boolean DEFAULT true;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workflows" ADD CONSTRAINT "workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
