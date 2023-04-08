import { Header } from '../../../components/Header';

import Welcome from '../welcome/Welcome';

export type RouteParams = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Recovery: undefined;
};

const StackRoutes = [
  {
    routeName: 'Welcome',
    component: Welcome,
    header: Header,
    screenName: 'Bienvenida'
  }
];

export { StackRoutes };
