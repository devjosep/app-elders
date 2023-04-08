import React, { Suspense } from 'react';

import {
  Loading,
  NotificationList
} from '@client/ui-components/src/components';

const Notifications = () => (
  <Suspense fallback={<Loading />}>
    <NotificationList />
  </Suspense>
);

export default Notifications;
