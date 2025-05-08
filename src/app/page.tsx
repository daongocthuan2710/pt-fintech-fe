'use client';

import { AppHeader } from '@/components';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const session = useSession();
  if (!session?.data?.user?.id) {
    router.push('/login');
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 gap-16">
      <AppHeader />
    </div>
  );
}
