import { getSectionHeader } from '../shared';
import Login from './Login';

export type RouteParams = {
  Login: undefined;
};

const StackRoutes = [
  {
    routeName: 'Login',
    component: Login,
    header: getSectionHeader(true, 'Iniciar sesión', 'Iniciar sesión')
  }
];

export { StackRoutes };
