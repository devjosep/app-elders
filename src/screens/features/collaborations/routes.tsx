import React from 'react';

// import { Collaboration } from '@client/common';
import { Collaboration } from './types';
import { SectionHeader } from '../../../components';
// import { SectionHeader } from '@client/ui-components/src/components';

import CollaborationCancel from './cancel/CollaborationCancel';
import CollaborationCancelConfirm from './cancel/CollaborationCancelConfirm';
import CollaborationDetail from './CollaborationDetail';
import HeaderIcon from '../../../assets/icons/help.svg';

export type RouteParams = {
  CollaborationDetail: {
    collaboration: Collaboration;
  };
  Collaborations: undefined;
  CollaborationCancel: {
    collaborationId: number;
    expiredCollaboration: boolean;
  };
  CollaborationCancelConfirm: {
    expiredCollaboration: boolean;
  };
  Error: undefined;
};

const StackRoutes = [
  {
    routeName: 'CollaborationDetail',
    component: CollaborationDetail,
    header: () => (
      <SectionHeader
        section='Peticiones'
        screenName='Detalle de colaboración'
        icon={HeaderIcon}
      />
    )
  },
  {
    routeName: 'CollaborationCancel',
    component: CollaborationCancel,
    header: () => (
      <SectionHeader
        section='Peticiones'
        screenName='Cancelación de colaboración'
        icon={HeaderIcon}
      />
    )
  },
  {
    routeName: 'CollaborationCancelConfirm',
    component: CollaborationCancelConfirm,
    header: () => (
      <SectionHeader
        section='Peticiones'
        screenName='Colaboración cancelada'
        icon={HeaderIcon}
        showGoBack={false}
      />
    )
  }
];

export { StackRoutes };
