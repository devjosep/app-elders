import * as yup from 'yup';

export type RecoveryFormModel = {
  username: string;
};

const recoveryFormInitialData: RecoveryFormModel = {
  username: ''
};

const recoveryFormValidationSchema = () =>
  yup
    .object()
    .required()
    .shape({
      username: yup
        .string()
        .required('El correo electrónico es obligatorio')
        .email('El correo electrónico no es correcto')
        .min(1, 'El número mínimo de carácteres es 1')
        .max(100, 'El número máximo de carácteres es 100')
        .label('E-mail')
    });

export { recoveryFormValidationSchema, recoveryFormInitialData };
