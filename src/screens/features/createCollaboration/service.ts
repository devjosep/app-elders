import { doFetch } from '@client/common/src/utils';

import { CreateCollaborationRequest } from './domain';

const createCollaboration = async (
  createColalborationRequest: CreateCollaborationRequest
) =>
  doFetch<CreateCollaborationRequest>({
    url: 'collaboration',
    method: 'POST',
    request: createColalborationRequest
  });

export { createCollaboration };
