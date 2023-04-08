import { useQuery } from 'react-query';

import { UserType } from '../../user';
import { ACTIVE_COLLABORATIONS_KEY } from './domain';
import { getActiveCollaborations } from './service';

const useGetActiveCollaborationsQuery = (userType: UserType) =>
  useQuery<string[], Error>(ACTIVE_COLLABORATIONS_KEY, () =>
    getActiveCollaborations(userType)
  );

export { useGetActiveCollaborationsQuery };
