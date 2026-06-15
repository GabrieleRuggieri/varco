import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {
  createDb,
  organizationMembers,
  organizations,
  userCredentials,
  users,
} from '@varco/database';

export type VarcoSessionUser = {
  id: string;
  email: string;
  name?: string | null;
  organizationId: string;
  organizationName: string;
  organizationIds: string[];
};

async function loadUserContext(userId: string) {
  const db = createDb();
  const rows = await db
    .select({
      organizationId: organizations.id,
      organizationName: organizations.name,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(eq(organizationMembers.userId, userId));

  if (rows.length === 0) {
    throw new Error('Utente senza organizzazione associata');
  }

  const primary = rows.find((r) => r.role === 'owner') ?? rows[0]!;
  return {
    organizationId: primary.organizationId,
    organizationName: primary.organizationName,
    organizationIds: rows.map((r) => r.organizationId),
  };
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();
        if (!email || !password) {
          return null;
        }

        const db = createDb();
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
          return null;
        }

        const [cred] = await db
          .select()
          .from(userCredentials)
          .where(eq(userCredentials.userId, user.id))
          .limit(1);
        if (!cred) {
          return null;
        }

        const valid = await compare(password, cred.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const ctx = await loadUserContext(user.id);
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.organizationId = ctx.organizationId;
        token.organizationName = ctx.organizationName;
        token.organizationIds = ctx.organizationIds;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub && token.email) {
        const user = session.user as VarcoSessionUser;
        user.id = token.sub;
        user.email = token.email;
        user.name = token.name ?? null;
        user.organizationId = token.organizationId as string;
        user.organizationName = token.organizationName as string;
        user.organizationIds = (token.organizationIds as string[]) ?? [];
      }
      return session;
    },
  },
};
