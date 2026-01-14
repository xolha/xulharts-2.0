CREATE TYPE "public"."page" AS ENUM('home', 'about', 'biscuit_pop', 'biscuit_chibi', 'biscuit_anime');--> statement-breakpoint
CREATE TABLE "page_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"page" "page" NOT NULL,
	"field_key" varchar(100) NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "page_content_page_field_key_unique" UNIQUE("page","field_key")
);
