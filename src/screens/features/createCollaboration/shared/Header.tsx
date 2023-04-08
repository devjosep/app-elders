import React from 'react';

import { SectionHeader } from '@client/ui-components/src/components';

import { useWizardStatus } from '../Wizard/stores/wizardStore';
// import RequestIcon from 'icons/help.svg';

const getSectionHeader = (canGoBack: boolean, screenName?: string) => () => {
  const { getScreenName } = useWizardStatus((x) => x);

  return (
    <SectionHeader
      showGoBack={canGoBack}
      goBackText='Salir'
      section='Peticiones'
      screenName={screenName || getScreenName()}
      // icon={RequestIcon}
    />
  );
};

export { getSectionHeader };
