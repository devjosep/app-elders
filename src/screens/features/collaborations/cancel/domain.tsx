import * as yup from 'yup';

export type CancelService = {
  message?: string;
  noComment: boolean;
};

const cancelFormInitialData: CancelService = {
  message: undefined,
  noComment: false
};

const cancelServiceValidationSchema = () =>
  yup
    .object()
    .required()
    .shape({
      noComment: yup.boolean(),
      message: yup.string().when('noComment', {
        is: false,
        then: yup
          .string()
          .required('El motivo es obligatorio')
          .max(500, 'El máximo de caracteres permitidos son 500')
          .min(5, 'Caracteres insuficientes')
      })
    });

export { cancelServiceValidationSchema, cancelFormInitialData };
