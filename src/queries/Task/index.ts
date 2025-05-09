// Libraries
import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Constants
import { QUERY_KEYS } from '@/constants';

// Libraries
import { useSession } from 'next-auth/react';

// Utils
import { queryClient } from '@/utils/queryClient';
import { taskService } from '@/services/Task';

// Models
import { TTask } from '@/models/Task';

type TGetTaskListParams<T> = {
  params?: {
    filterField?: string;
    filterValues?: string[];
    sort?: string;
    az?: string;
    searchTitle: string;
  };
  options?: UseQueryOptions<any, any, T, (string | number)[]>;
};

export const useGetTaskList = <T = TTask[]>(props?: TGetTaskListParams<T>) => {
  const { data } = useSession();
  const { user, accessToken: token = '' } = data || {};
  const { id: userId = '', role = 'user' } = user || {};

  const { options, params } = props || {};
  const { filterField = '', filterValues, sort = '', az = '', searchTitle } = params || {};

  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_TASK_LIST,
      userId,
      role,
      token,
      sort,
      az,
      filterField,
      JSON.stringify({ filterValues }) || '',
      searchTitle,
    ],
    queryFn: () =>
      taskService.getListTasks({
        userId,
        role,
        token,
        filterField,
        filterValues,
        sort,
        az,
        searchTitle,
      }),
    placeholderData: [],
    ...options,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TASK_LIST],
        exact: false,
      });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TASK_LIST],
        exact: false,
      });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    },
  });
};

// export const useDeleteBrand = () => {
//   return useMutation(deleteBrand, {
//     onSuccess: () => {
//       queryClient.invalidateQueries([QUERY_KEYS.GET_BRAND_LIST], {
//         exact: false,
//       });
//     },
//   });
// };
