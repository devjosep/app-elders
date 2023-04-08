import { useMutation, useQueryClient } from 'react-query';

import { CONVERSATIONS_KEY } from './domain';
import { updateConversation } from './service';

type ConversationMessage = {
  cid360: string;
  message: string;
  messageDate: string;
};

const useUpdateConversationMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    void,
    void,
    ConversationMessage,
    (error: unknown) => void
  >(
    ({ cid360, message, messageDate }: ConversationMessage) =>
      updateConversation(cid360, message, messageDate),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CONVERSATIONS_KEY);
      }
    }
  );
  return mutation;
};

export { useUpdateConversationMutation };
