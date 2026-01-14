CREATE TYPE "public"."gallery_category" AS ENUM('biscuit_pop', 'biscuit_chibi', 'biscuit_anime', 'artes_a_mao', 'artes_digitais', 'comissoes');--> statement-breakpoint
CREATE TYPE "public"."hero_slot" AS ENUM('home_emotes', 'home_badges', 'home_corpo', 'home_chibi', 'about_main', 'biscuit_pop_hero', 'biscuit_chibi_hero', 'biscuit_anime_hero');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "gallery_category" NOT NULL,
	"url" text NOT NULL,
	"blob_id" text NOT NULL,
	"alt_text" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"slot" "hero_slot" NOT NULL,
	"url" text NOT NULL,
	"blob_id" text NOT NULL,
	"alt_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hero_images_slot_unique" UNIQUE("slot")
);
