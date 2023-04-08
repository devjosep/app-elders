import { useQuery } from 'react-query';

import { HAS_NOTIFICATIONS_KEY } from './domain';
import { getUnreadNotificationsCount } from './service';

const useGetUnreadNotificationsCountQuery = () => {
  const query = useQuery(HAS_NOTIFICATIONS_KEY, getUnreadNotificationsCount, {
    suspense: false,
    useErrorBoundary: false
  });
  return query;
};

export { useGetUnreadNotificationsCountQuery };
