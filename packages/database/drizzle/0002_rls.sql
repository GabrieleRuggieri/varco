-- Migration 0002: Row Level Security per tenant isolation
-- Ogni tabella con organization_id ottiene una policy RLS che blocca accessi cross-tenant.
-- L'app imposta "SET LOCAL varco.org_id = '<uuid>'" ad ogni transazione autenticata.
-- Per applicare: pnpm db:migrate

-- ───────────────────────────────────────────────
-- Helper: funzione per leggere l'org corrente
-- ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION current_org_id() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('varco.org_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

-- ───────────────────────────────────────────────
-- organizations
-- ───────────────────────────────────────────────
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON organizations;
CREATE POLICY org_isolation ON organizations
  USING (id = current_org_id());

-- ───────────────────────────────────────────────
-- organization_members
-- ───────────────────────────────────────────────
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON organization_members;
CREATE POLICY org_isolation ON organization_members
  USING (organization_id = current_org_id());

-- ───────────────────────────────────────────────
-- catalog_connections
-- ───────────────────────────────────────────────
ALTER TABLE catalog_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_connections FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON catalog_connections;
CREATE POLICY org_isolation ON catalog_connections
  USING (organization_id = current_org_id());

-- ───────────────────────────────────────────────
-- products
-- ───────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON products;
CREATE POLICY org_isolation ON products
  USING (organization_id = current_org_id());

-- ───────────────────────────────────────────────
-- skus (via products)
-- ───────────────────────────────────────────────
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON skus;
CREATE POLICY org_isolation ON skus
  USING (
    product_id IN (
      SELECT id FROM products WHERE organization_id = current_org_id()
    )
  );

-- ───────────────────────────────────────────────
-- classification_runs (via skus → products)
-- ───────────────────────────────────────────────
ALTER TABLE classification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE classification_runs FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON classification_runs;
CREATE POLICY org_isolation ON classification_runs
  USING (
    sku_id IN (
      SELECT s.id FROM skus s
      JOIN products p ON s.product_id = p.id
      WHERE p.organization_id = current_org_id()
    )
  );

-- ───────────────────────────────────────────────
-- checklist_items (via skus → products)
-- ───────────────────────────────────────────────
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON checklist_items;
CREATE POLICY org_isolation ON checklist_items
  USING (
    sku_id IN (
      SELECT s.id FROM skus s
      JOIN products p ON s.product_id = p.id
      WHERE p.organization_id = current_org_id()
    )
  );

-- ───────────────────────────────────────────────
-- documents (via skus → products)
-- ───────────────────────────────────────────────
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON documents;
CREATE POLICY org_isolation ON documents
  USING (
    sku_id IN (
      SELECT s.id FROM skus s
      JOIN products p ON s.product_id = p.id
      WHERE p.organization_id = current_org_id()
    )
  );

-- ───────────────────────────────────────────────
-- partner_requests
-- ───────────────────────────────────────────────
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_requests FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON partner_requests;
CREATE POLICY org_isolation ON partner_requests
  USING (organization_id = current_org_id());

-- ───────────────────────────────────────────────
-- partner_webhook_events (via partner_requests)
-- ───────────────────────────────────────────────
ALTER TABLE partner_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_webhook_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_isolation ON partner_webhook_events;
CREATE POLICY org_isolation ON partner_webhook_events
  USING (
    partner_request_id IS NULL OR
    partner_request_id IN (
      SELECT id FROM partner_requests WHERE organization_id = current_org_id()
    )
  );

-- ───────────────────────────────────────────────
-- Tabelle condivise (nessun RLS — dati pubblici)
-- ───────────────────────────────────────────────
-- matrix_versions, obligation_rules, rule_change_logs:
-- sono dati condivisi tra tutti i tenant, gestiti solo da admin.
-- Non appliciamo RLS ma nessun route API espone scrittura diretta.
