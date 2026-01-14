CREATE TABLE "category_settings" (
	"category" "gallery_category" PRIMARY KEY NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"coming_soon_message" text DEFAULT 'Em breve!',
	"updated_at" timestamp DEFAULT now() NOT NULL
);
