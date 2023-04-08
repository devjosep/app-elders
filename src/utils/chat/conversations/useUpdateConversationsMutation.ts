import { useMutation, useQueryClient } from 'react-query';

import { UserType } from '../../user';
import { MessageReceived } from '../messages/domain';
import { CONVERSATIONS_KEY } from './domain';
import { updateConversations } from './service';

const useUpdateConversationsMutation = (
  userType: UserType,
  currentConversationDestionationId?: string
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    void,
    void,
    MessageReceived[],
    (error: unknown) => void
  >(
    (messages: MessageReceived[]) =>
      updateConversations(
        userType,
        currentConversationDestionationId,
        ...messages
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CONVERSATIONS_KEY);
      }
    }
  );
  return mutation;
};

export { useUpdateConversationsMutation };
