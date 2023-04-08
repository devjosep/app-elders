import React from 'react';

import HeaderIcon from '../../../assets/icons/bell.svg';
import { SectionHeader } from '@client/ui-components/src/components';

import Notifications from './Notifications';

export type RouteParams = {
  Notifications: undefined;
};

const StackRoutes = [
  {
    routeName: 'Notifications',
    component: Notifications,
    header: () => (
      <SectionHeader
        section='Notificaciones'
        screenName='Notificaciones'
        icon={HeaderIcon}
      />
    )
  }
];

export { StackRoutes };
