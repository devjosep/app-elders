import { getSectionHeader } from '../shared';
// import Register from './Register';
import RegisterConfirmation from './RegisterConfirmation';
import RegisterError from './RegisterError';
import RegisterValidationSMS from './RegisterValidationSMS';

export type RouteParams = {
  Register: undefined;
  RegisterValidationSMS: {
    token: string;
  };
  RegisterConfirmation: undefined;
  RegisterError: {
    message: string;
  };
  Welcome: undefined;
};

const StackRoutes = [
  // {
  //   routeName: 'Register',
  //   component: Register,
  //   header: getSectionHeader(true, 'Registro', 'Registro')
  // },
  {
    routeName: 'RegisterValidationSMS',
    component: RegisterValidationSMS,
    header: getSectionHeader(true, 'Registro', 'Validación de registro (SMS)')
  },
  {
    routeName: 'RegisterConfirmation',
    component: RegisterConfirmation,
    header: getSectionHeader(true, 'Registro', 'Registro confirmado')
  },
  {
    routeName: 'RegisterError',
    component: RegisterError,
    header: getSectionHeader(true, 'Registro', 'Error al registrar')
  }
];

export { StackRoutes };
