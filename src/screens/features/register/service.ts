import { doFetch } from '@client/common/src/utils';

import {
  RegisterFormModel,
  RegisterResponse,
  ValidationSMSFormModel
} from './domain';

const registerUser = (
  registerFormData: RegisterFormModel
): Promise<RegisterResponse> =>
  doFetch<RegisterFormModel, RegisterResponse>({
    url: 'elder',
    method: 'POST',
    request: registerFormData,
    apiVersion: 2
  });

const validationSMS = (validationSMSFormData: ValidationSMSFormModel) =>
  doFetch<void, void, ValidationSMSFormModel>({
    url: 'smsValidation',
    method: 'GET',
    queryString: validationSMSFormData,
    withStringify: true
  });

export { registerUser, validationSMS };
