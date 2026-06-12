CREATE TYPE "public"."catalog_provider" AS ENUM('shopify', 'amazon');--> statement-breakpoint
CREATE TYPE "public"."checklist_status" AS ENUM('open', 'in_progress', 'blocked', 'completed', 'waived', 'needs_review');--> statement-breakpoint
CREATE TYPE "public"."country_code" AS ENUM('DE', 'FR', 'IT', 'ES', 'NL');--> statement-breakpoint
CREATE TYPE "public"."matrix_review_status" AS ENUM('bozza', 'revisionata', 'approvata');--> statement-breakpoint
CREATE TYPE "public"."obligation_type" AS ENUM('responsible_person', 'technical_file', 'declaration_of_conformity', 'labeling', 'epr_packaging', 'product_safety_assessment');--> statement-breakpoint
CREATE TYPE "public"."org_role" AS ENUM('owner', 'member', 'regulatory_admin');--> statement-breakpoint
CREATE TYPE "public"."partner_request_status" AS ENUM('draft', 'submitted', 'processing', 'active', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."partner_request_type" AS ENUM('rp', 'epr_packaging');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('toys', 'apparel', 'electronics_accessories', 'cosmetics', 'home');--> statement-breakpoint
CREATE TYPE "public"."severity_level" AS ENUM('critical', 'high', 'medium', 'low');--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"default_target_countries" "country_code"[] DEFAULT '{}' NOT NULL,
	"plan" text DEFAULT 'starter' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"email_verified" timestamp with time zone,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "catalog_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"provider" "catalog_provider" NOT NULL,
	"credentials_ref" text,
	"external_shop_id" text,
	"last_sync_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"external_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"materials" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category_hint" "product_category",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku_code" text NOT NULL,
	"variant_attrs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"target_countries" "country_code"[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matrix_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version_label" text NOT NULL,
	"content_hash" text NOT NULL,
	"deployed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deployed_by" text,
	CONSTRAINT "matrix_versions_content_hash_unique" UNIQUE("content_hash")
);
--> statement-breakpoint
CREATE TABLE "obligation_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"matrix_version_id" uuid NOT NULL,
	"countries" "country_code"[] NOT NULL,
	"product_categories" "product_category"[] NOT NULL,
	"obligation_type" "obligation_type" NOT NULL,
	"severity" "severity_level" NOT NULL,
	"regulation_ref" text NOT NULL,
	"deadline_type" text NOT NULL,
	"checklist_template_id" text,
	"effective_from" timestamp with time zone NOT NULL,
	"review_status" "matrix_review_status" DEFAULT 'bozza' NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rule_change_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_id" text NOT NULL,
	"change_type" text NOT NULL,
	"changed_by" text NOT NULL,
	"summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku_id" uuid NOT NULL,
	"obligation_rule_id" text NOT NULL,
	"country" "country_code" NOT NULL,
	"status" "checklist_status" DEFAULT 'open' NOT NULL,
	"due_at" timestamp with time zone,
	"waived_reason" text,
	"classification_run_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classification_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku_id" uuid NOT NULL,
	"matrix_version_id" uuid NOT NULL,
	"llm_provider" text NOT NULL,
	"structured_output" jsonb NOT NULL,
	"confidence" numeric(4, 3),
	"matched_rule_ids" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku_id" uuid NOT NULL,
	"template_id" text NOT NULL,
	"version" text NOT NULL,
	"storage_key" text NOT NULL,
	"mime_type" text DEFAULT 'application/pdf' NOT NULL,
	"checksum" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"sku_id" uuid,
	"type" "partner_request_type" NOT NULL,
	"country" "country_code" NOT NULL,
	"status" "partner_request_status" DEFAULT 'draft' NOT NULL,
	"external_ref" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_request_id" uuid,
	"payload" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_connections" ADD CONSTRAINT "catalog_connections_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligation_rules" ADD CONSTRAINT "obligation_rules_matrix_version_id_matrix_versions_id_fk" FOREIGN KEY ("matrix_version_id") REFERENCES "public"."matrix_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rule_change_logs" ADD CONSTRAINT "rule_change_logs_rule_id_obligation_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."obligation_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_obligation_rule_id_obligation_rules_id_fk" FOREIGN KEY ("obligation_rule_id") REFERENCES "public"."obligation_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_classification_run_id_classification_runs_id_fk" FOREIGN KEY ("classification_run_id") REFERENCES "public"."classification_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classification_runs" ADD CONSTRAINT "classification_runs_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classification_runs" ADD CONSTRAINT "classification_runs_matrix_version_id_matrix_versions_id_fk" FOREIGN KEY ("matrix_version_id") REFERENCES "public"."matrix_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_requests" ADD CONSTRAINT "partner_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_requests" ADD CONSTRAINT "partner_requests_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_webhook_events" ADD CONSTRAINT "partner_webhook_events_partner_request_id_partner_requests_id_fk" FOREIGN KEY ("partner_request_id") REFERENCES "public"."partner_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "catalog_connections_org_id_idx" ON "catalog_connections" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_connections_org_provider_uidx" ON "catalog_connections" USING btree ("organization_id","provider");--> statement-breakpoint
CREATE INDEX "products_org_id_idx" ON "products" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_org_external_uidx" ON "products" USING btree ("organization_id","external_id");--> statement-breakpoint
CREATE INDEX "skus_product_id_idx" ON "skus" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "skus_product_sku_code_uidx" ON "skus" USING btree ("product_id","sku_code");--> statement-breakpoint
CREATE INDEX "obligation_rules_matrix_version_idx" ON "obligation_rules" USING btree ("matrix_version_id");--> statement-breakpoint
CREATE INDEX "obligation_rules_review_status_idx" ON "obligation_rules" USING btree ("review_status");--> statement-breakpoint
CREATE INDEX "checklist_items_sku_status_idx" ON "checklist_items" USING btree ("sku_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "checklist_items_sku_country_rule_uidx" ON "checklist_items" USING btree ("sku_id","country","obligation_rule_id");--> statement-breakpoint
CREATE INDEX "classification_runs_sku_id_idx" ON "classification_runs" USING btree ("sku_id");--> statement-breakpoint
CREATE INDEX "documents_sku_id_idx" ON "documents" USING btree ("sku_id");--> statement-breakpoint
CREATE INDEX "partner_requests_org_id_idx" ON "partner_requests" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "partner_requests_status_idx" ON "partner_requests" USING btree ("status");