// Libraries
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export const getQueryClient = cache(() => new QueryClient());
