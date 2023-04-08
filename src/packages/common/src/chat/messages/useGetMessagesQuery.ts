import { useInfiniteQuery } from 'react-query';

import { Paginated } from '../../shared/paginated';
import { Message, MESSAGES_CONVERSATION_KEY } from './domain';
import { getMessages } from './service';

const useGetMessagesQuery = (
  currentUserId: string,
  destinationUserId: string,
  isConnected: boolean
) => {
  const query = useInfiniteQuery<Paginated<Message>>(
    MESSAGES_CONVERSATION_KEY(currentUserId, destinationUserId),
    ({ pageParam }) => getMessages(currentUserId, destinationUserId, pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage.canFetchMore ? lastPage.nextPage : undefined,
      enabled: isConnected
    }
  );

  return query;
};

export { useGetMessagesQuery };
