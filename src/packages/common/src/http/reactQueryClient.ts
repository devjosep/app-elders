import { QueryClient } from 'react-query';

import { navigate } from '../navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: false,
      retry: 3
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        navigate('ErrorMutation', { message: (error as Error)?.message });
      }
    }
  }
});

export { queryClient };
