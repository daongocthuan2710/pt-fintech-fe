'use client';

import { SessionProvider as NextSessionProvider } from 'next-auth/react';

export const SessionProvider = ({ children, session }: any) => {
  return <NextSessionProvider session={session}>{children}</NextSessionProvider>;
};
