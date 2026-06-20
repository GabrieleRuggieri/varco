/**
 * Servizio organizzazioni — membership utente cross-tenant.
 * Usa withUserContext (non org) perché un utente può appartenere a più org.
 */
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  organizationMembers,
  organizations,
  withUserContext,
  type Database,
} from '@varco/database';
import { DATABASE } from '../database/database.module';

@Injectable()
/** Esportazione `OrganizationsService` — vedi implementazione sotto. */
export class OrganizationsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Tutte le organizzazioni in cui l'utente è membro (policy RLS user_id). */
  async findMembershipsForUser(userId: string) {
    return withUserContext(this.db, userId, (tx) =>
      tx
        .select({
          id: organizations.id,
          name: organizations.name,
          defaultTargetCountries: organizations.defaultTargetCountries,
          plan: organizations.plan,
          role: organizationMembers.role,
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
        .where(eq(organizationMembers.userId, userId)),
    );
  }
}
