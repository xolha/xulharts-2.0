ALTER TYPE "public"."page" ADD VALUE 'artes_a_mao';--> statement-breakpoint
ALTER TYPE "public"."page" ADD VALUE 'artes_digitais';--> statement-breakpoint
ALTER TYPE "public"."page" ADD VALUE 'comissoes';--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");