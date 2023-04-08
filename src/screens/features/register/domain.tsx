import * as yup from 'yup';

import { isPastDate, isValidDate } from '@client/common';

//1 for DNI 2 for Passport and for NIE
export type DocumenType = 1 | 2 | 3;

export type RegisterFormModel = {
  documentType: DocumenType;
  document: string;
  name: string;
  email: string;
  phone: string;
  privacyTermsAccepted: boolean;
  birthday: string;
  day: string;
  month: string;
  year: string;
  birthplace: number;
};

export type RegisterResponse = {
  token: string;
  tokenExpires: Date;
};

export type BirthPlaceModel = {
  id: number;
  place: string;
};

const registerFormInitialData: RegisterFormModel = {
  documentType: 1,
  document: '',
  name: '',
  email: '',
  phone: '',
  birthday: '',
  day: '',
  month: '',
  year: '',
  birthplace: 1,
  privacyTermsAccepted: false
};

const registerFormValidationSchema = () =>
  yup
    .object()
    .required()
    .shape(
      {
        documentType: yup.number<1 | 6>().required().label('Tipo de documento'),
        document: yup
          .string()
          .required('El documento es obligatorio')
          .when('documentType', {
            is: 1,
            then: yup
              .string()
              .matches(
                /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]/i,
                'El formato del DNI no es correcto'
              )
          })
          .when('documentType', {
            is: 3,
            then: yup
              .string()
              .matches(
                /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]/i,
                'El formato del NIE o Tarjeta de residencia no es correcto'
              )
          })
          .max(100, 'El máximo número de carácteres es 100')
          .label('Documento'),
        name: yup
          .string()
          .required('El nombre es obligatorio')
          .max(30, 'El máximo número de carácteres es 30')
          .min(2, 'El mínimo número de caracteres es 2')
          .matches(/^([\u00c0-\u01ffa-zA-Z'-])/, 'Caracteres no permitidos')
          .label('Nombre'),
        email: yup
          .string()
          .required('El correo electrónico es obligatorio')
          .email('El correo electrónico no es correcto')
          .min(1, 'El número mínimo de carácteres es 1')
          .max(100, 'El número máximo de carácteres es 100')
          .label('E-mail'),
        phone: yup
          .string()
          .required('El teléfono es obligatorio')
          .matches(/^[6|7]\d{8}/, 'Sólo numeros empezando por 6 o 7')
          .length(9, 'El número de caracteres es 9')
          .label('Phone'),
        privacyTermsAccepted: yup
          .bool()
          .oneOf([true], 'Tienes que aceptar las condiciones de privacidad'),
        day: yup.string().required('El día es obligatorio'),
        month: yup.string().required('El mes es obligatorio'),
        year: yup.string().required('El año es obligatorio'),
        birthday: yup
          .string()
          .required('Fecha de nacimiento es obligatoria')
          .when(['day', 'month', 'year'], {
            is: (day, month, year) => {
              return !!day && !!month && !!year;
            },
            then: yup
              .string()
              .required('La fecha de nacimiento es obligatoria')
              .test(
                'fechaNacimiento',
                () => 'La fecha de nacimiento es incorrecta',
                function (value) {
                  return (
                    !!value &&
                    isValidDate(new Date(value)) &&
                    isPastDate(new Date(value))
                  );
                }
              )
          }),
        birthplace: yup.number<1 | 52>().required().label('Lugar de nacimiento')
      },
      [
        ['fechaNacimiento', 'day'],
        ['fechaNacimiento', 'month'],
        ['fechaNacimiento', 'year']
      ]
    );

export type ValidationSMSFormModel = {
  code: string;
  token: string;
};

const validationSMSFormInitialData: ValidationSMSFormModel = {
  code: '',
  token: ''
};

const validationSMSFormValidationSchema = () =>
  yup
    .object()
    .required()
    .shape({
      code: yup
        .string()
        .required('El código es obligatorio')
        .min(1, 'El número mínimo de carácteres es 1')
        .max(10, 'El número máximo de carácteres es 10')
        .label('Code')
    });

export {
  registerFormValidationSchema,
  registerFormInitialData,
  validationSMSFormInitialData,
  validationSMSFormValidationSchema
};
