import React from 'react';

import { SectionHeader } from '@client/ui-components/src/components';

import RegisterIcon from 'icons/register.svg';

const getSectionHeader =
  (canGoBack: boolean, section: string, screenName?: string) => () =>
    (
      <SectionHeader
        section={section}
        screenName={screenName}
        showGoBack={canGoBack}
        icon={RegisterIcon}
      />
    );

export { getSectionHeader };
