import { Inject, Injectable } from '@nestjs/common';
import { type Database, organizations } from '@varco/database';
import { DATABASE } from '../database/database.module';

@Injectable()
export class OrganizationsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Elenco organizzazioni (MVP: pochi tenant demo) */
  async findAll() {
    return this.db.select().from(organizations);
  }
}
