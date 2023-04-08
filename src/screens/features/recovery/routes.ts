import Recovery from './Recovery';
import { getSectionHeader } from '../shared';
import RecoveryConfirmation from '../../features/recovery/RecoveryConfirmation';

export type RouteParams = {
  Recovery: undefined;
  RecoveryConfirmation: undefined;
  Welcome: undefined;
  ErrorMutation: undefined;
};

const StackRoutes = [
  {
    routeName: 'Recovery',
    component: Recovery,
    header: getSectionHeader(
      true,
      'Recuperar contraseña',
      'Recuperar contraseña'
    )
  },
  {
    routeName: 'RecoveryConfirmation',
    component: RecoveryConfirmation,
    header: getSectionHeader(
      true,
      'Recuperar contraseña',
      'Confirmación Recuperar contraseña'
    )
  }
];

export { StackRoutes };
