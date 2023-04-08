import { doFetch } from '@client/common/src/utils';

import { RecoveryFormModel } from './domain';

const recovery = (recoveryFormData: RecoveryFormModel) =>
  doFetch<RecoveryFormModel>({
    url: 'elder/elder/passwordreset',
    method: 'POST',
    request: recoveryFormData,
    token: ''
  });

export { recovery };
