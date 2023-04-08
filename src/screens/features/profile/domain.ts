import * as yup from 'yup';

export type ProfileFormModel = {
  name: string;
  phone: string;
};

export type ProfileModel = ProfileFormModel;

const profileFormValidationSchema = () =>
  yup
    .object()
    .required()
    .shape({
      name: yup
        .string()
        .required('El nombre es obligatorio')
        .max(30, 'El máximo número de caracteres es 30')
        .min(2, 'El mínimo número de caracteres es 2')
        .matches(/^([\u00c0-\u01ffa-zA-Z'-])/, 'Caracteres no permitidos')
        .label('Nombre'),
      phone: yup
        .string()
        .required('El teléfono es obligatorio')
        .length(9, 'Introduce 9 números')
        .matches(/^[6|7]\d{8}/, 'Sólo números empezados por 6 o 7')
        .label('Phone')
    });

export type ChangePasswordFormModel = {
  username: string;
  password: string;
  repeatPassword: string;
};

export type RemoveProfileModel = {
  username: string;
};

const ChangePasswordFormValidationSchema = () =>
  yup
    .object()
    .required()
    .shape({
      password: yup
        .string()
        .required('Introduce nueva contraseña')
        .length(8, 'Tiene que tener 8 caracteres')
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/gm,
          'Mín. una mayúsculas y un número'
        )
        .label('Contraseña'),
      repeatPassword: yup
        .string()
        .required('Introduce de nuevo la contraseña')
        .length(8, 'Tiene que tener 8 caracteres')
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/gm,
          '8 caracteres (Mínimo una mayúsculas y un número)'
        )
        .label('Repita contraseña')
        .test(
          'repeatPassword',
          () => 'La contraseña no coincide',
          function (value) {
            return this.parent.password === value;
          }
        )
    });
export { profileFormValidationSchema, ChangePasswordFormValidationSchema };
