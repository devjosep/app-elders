import React, { ReactElement } from 'react';

import { WizardStepProps } from '../domain';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';

type wizardFactoryProps = {
  currentStep: number;
  wizardStepProps: WizardStepProps;
  isLoading: boolean;
  otherService: () => void;
  DigitalCompany : () => void
  onSubmit: () => Promise<void>;
};

const getWizardStepComponent = ({
  currentStep,
  wizardStepProps,
  isLoading,
  otherService,
  onSubmit,
  DigitalCompany
}: wizardFactoryProps): ReactElement | null => {
  switch (currentStep) {
    case 0:
      return <Step1 otherService={otherService} {...wizardStepProps} />;
    case 1:
      return <Step2 digitalCompany={DigitalCompany}{...wizardStepProps} />;
    case 2:
      return <Step3 {...wizardStepProps} />;
    case 3:
      return <Step4 {...wizardStepProps} />;
    case 4:
      return <Step5 {...wizardStepProps} />;
    case 5:
      return (
        <Step6 isLoading={isLoading} onSubmit={onSubmit} {...wizardStepProps} />
      );
    default:
      return null;
  }
};

export { getWizardStepComponent };
