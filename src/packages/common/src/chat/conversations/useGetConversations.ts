import { useInfiniteQuery } from 'react-query';

import { Paginated } from '../../shared/paginated';
import { UserType } from '../../user';
import { Conversation, CONVERSATIONS_KEY } from './domain';
import { getConversations } from './service';

const useGetConversationsQuery = (
  userType: UserType,
  activeCollaborations: string[] | undefined
) => {
  const query = useInfiniteQuery<Paginated<Conversation>>(
    CONVERSATIONS_KEY,
    ({ pageParam }) =>
      getConversations(userType, activeCollaborations!, pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage.canFetchMore ? lastPage.nextPage : undefined,
      enabled: !!activeCollaborations
    }
  );

  return query;
};

export { useGetConversationsQuery };
