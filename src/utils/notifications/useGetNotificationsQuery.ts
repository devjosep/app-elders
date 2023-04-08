import { useInfiniteQuery } from 'react-query';

import { Paginated } from '../shared/paginated';
import { NOTIFICATIONS_KEY, Notification } from './domain';
import { getNotifications } from './service';

const useGetNotificationsQuery = () => {
  const query = useInfiniteQuery<Paginated<Notification>>(
    NOTIFICATIONS_KEY,
    ({ pageParam }) => getNotifications(pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage?.canFetchMore ? lastPage.nextPage - 1 : undefined
    }
  );

  return query;
};

export { useGetNotificationsQuery };
