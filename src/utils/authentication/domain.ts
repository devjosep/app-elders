import * as yup from 'yup';

export type LoginInfo = {
  username: string;
  password: string;
};

const loginValidationSchema = () =>
  yup.object().shape({
    username: yup.string().required('El nombre de usuario es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria')
  });

export { loginValidationSchema };
