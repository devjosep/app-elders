import { useMutation, useQueryClient } from 'react-query';

import { NOTIFICATIONS_KEY } from './domain';
import { postReadNotification } from './service';

const useReadNotificationMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number, (error: unknown) => void>(
    (id) => postReadNotification(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(NOTIFICATIONS_KEY);
      }
    }
  );
  return mutation;
};

export { useReadNotificationMutation };
