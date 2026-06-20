-- Migration 0003: policy RLS per flussi auth cross-tenant
-- Permette a un utente autenticato di leggere le proprie membership
-- quando varco.user_id è impostato (login, GET /organizations/me).

CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('varco.user_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

-- organization_members: lettura delle proprie membership
DROP POLICY IF EXISTS user_memberships_read ON organization_members;
CREATE POLICY user_memberships_read ON organization_members
  FOR SELECT
  USING (user_id = current_user_id());

-- organizations: lettura org in cui l'utente è membro
DROP POLICY IF EXISTS user_orgs_read ON organizations;
CREATE POLICY user_orgs_read ON organizations
  FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = current_user_id()
    )
  );
