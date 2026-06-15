import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type Database, organizationMembers, organizations } from '@varco/database';
import { DATABASE } from '../database/database.module';

@Injectable()
export class OrganizationsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findMembershipsForUser(userId: string) {
    return this.db
      .select({
        id: organizations.id,
        name: organizations.name,
        defaultTargetCountries: organizations.defaultTargetCountries,
        plan: organizations.plan,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
      .where(eq(organizationMembers.userId, userId));
  }
}
