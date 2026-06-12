import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { countryCodeEnum } from './enums.js';

/** Organizzazione seller — tenant principale */
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  /** Paesi target di default per nuovi SKU */
  defaultTargetCountries: countryCodeEnum('default_target_countries').array().notNull().default([]),
  plan: text('plan').notNull().default('starter'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Utente — compatibile con Auth.js (fase auth) */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
