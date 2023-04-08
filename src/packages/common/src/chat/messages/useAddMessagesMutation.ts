import { useMutation, useQueryClient } from 'react-query';

import { Message, MESSAGES_KEY } from './domain';
import { addMessages } from './service';

const useAddMessagesMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, void, Message[], (error: unknown) => void>(
    addMessages,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MESSAGES_KEY);
      }
    }
  );
  return mutation;
};

export { useAddMessagesMutation };
