import { useMutation, useQueryClient } from 'react-query';

import { NOTIFICATIONS_KEY } from './domain';
import { postRatingCollaboration, PostRatingMutation } from './service';

const useRatingMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    void,
    Error,
    PostRatingMutation,
    (error: unknown) => void
  >((data) => postRatingCollaboration(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(NOTIFICATIONS_KEY);
    }
  });
  return mutation;
};

export { useRatingMutation };
