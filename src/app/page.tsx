'use client';

import { AppHeader } from '@/components';
import { TaskListing } from '@/components/partials/TaskManagement';
import { Flex } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Flex align="center" justify="center" className="w-full h-full">
        <div className="text-center">Loading...</div>
      </Flex>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
  }

  return status === 'authenticated' ? (
    <Flex
      vertical
      gap={16}
      align="center"
      className="font-sans justify-items-center min-h-screen !p-4"
    >
      <AppHeader />
      <TaskListing />
    </Flex>
  ) : null;
}
