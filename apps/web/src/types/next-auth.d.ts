import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      organizationId: string;
      organizationName: string;
      organizationIds: string[];
    };
  }

  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    organizationId?: string;
    organizationName?: string;
    organizationIds?: string[];
  }
}
