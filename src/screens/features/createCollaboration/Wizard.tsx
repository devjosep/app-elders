import React, {
  Suspense,
  useState,
  ReactElement,
  useMemo,
  useEffect
} from 'react';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { useMutation } from 'react-query';

import { Loading } from '@client/ui-components/src/components/Loading';

import { Prompt } from './Prompt/Prompt';
import { createCollaboration as createCollaborationService } from './service';
import { InitialWizardModal } from './Wizard/InitialWizardModal';
import { getWizardStepComponent } from './Wizard/wizardFactory';
import { useWizardStatus } from './Wizard/stores/wizardStore';
import DigitalCompany from './Wizard/DigitalCompany';

const Wizard = (): ReactElement => {
  const [otherService, setOtherService] = useState(false);
  const [digitalCompany, setdigitalCompany] = useState(false);
  const navigation = useNavigation();

  const {
    activity,
    date,
    direction,
    additionalData,
    reset,
    step,
    setStep,
    showingModal,
    setShowingModal
  } = useWizardStatus();

  const nextStep = () => setStep(step + 1);
  const previousStep = () => setStep(step - 1);

  const handlePromptConfirm = () => {
    reset();
  };

  const handleOtherService = () => {
    setOtherService(true);
  };

  const handleOtherDigital = () => {
    setdigitalCompany(true);
  };

  const {
    mutateAsync: createCollaboration,
    isLoading,
    isSuccess
  } = useMutation(createCollaborationService, {
    onSuccess: () => {
      reset();
    }
  });

  const handleOnSubmit = async () =>
    await createCollaboration({
      additionalData,
      description: activity?.description ?? '',
      place: direction,
      requestDate: date,
      serviceCode: activity?.id ?? 1
    });

  useEffect(() => {
    if (isSuccess) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'Confirmation' }]
        })
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (otherService) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'OtherService' }]
        })
      );
    }
  }, [otherService]);

  useEffect(() => {
    if (digitalCompany) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'DigitalCompany' }]
        })
      );
    }
  }, [digitalCompany]);

  useEffect(() => {
    setShowingModal(true);
  }, []);

  const CurrentStepComponent = useMemo(
    () =>
      getWizardStepComponent({
        currentStep: step,
        wizardStepProps: {
          goNext: nextStep,
          goPrevious: previousStep,
          setStep
        },
        isLoading,
        otherService: handleOtherService,
        onSubmit: handleOnSubmit,
        DigitalCompany : handleOtherDigital
      }),
    [step, isLoading]
  );


  return (
    <Suspense fallback={<Loading />}>
      {showingModal && (
        <InitialWizardModal onClose={() => setShowingModal(false)} />
      )}
      {!isSuccess && !otherService && (
        <Prompt promptConfirm={handlePromptConfirm} />
      )}
      {CurrentStepComponent}
      
    </Suspense>
  );
};

export default Wizard;
