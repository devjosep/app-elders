import { doFetch } from '@client/common';

export type CancelServiceRequest = {
  reason?: string;
  id: number;
};

const cancelService = async (cancelServiceRequest: CancelServiceRequest) =>
  doFetch({
    url: 'collaboration/eldercancel',
    method: 'PUT',
    request: cancelServiceRequest
  });

export { cancelService };
