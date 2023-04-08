import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useAccessibilityAutoFocus } from '@client/common';
import {
  ResumeCharacters,
  TextArea
} from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { WizardStepProps, step4ValidationSchema } from '../domain';
import { Actions } from '../shared/Actions';
import { WizardSteps } from 'features/createCollaboration/shared/WizardSteps';
import { useWizardStatus } from 'stores/wizardStore';

type Step4FormModel = {
  direction: string;
};

const Step4 = ({ goNext, goPrevious }: WizardStepProps) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();

  const { activity, direction, setDirection } = useWizardStatus(
    ({ activity, direction, setDirection }) => ({
      activity,
      direction,
      setDirection
    })
  );
  const formMethods = useForm<Step4FormModel>({
    resolver: yupResolver(step4ValidationSchema()),
    defaultValues: { direction }
  });

  const { control, handleSubmit, errors } = formMethods;

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const onSubmit = (data: Step4FormModel) => {
    setDirection(data.direction);
    goNext?.();
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorsMessage = Object.values(errors)
        .map((x) => x?.message ?? '')
        .toString();

      announceForAccessibility(
        `Tienes los siguentes errores. ${errorsMessage}`
      );
    }
  }, [errors]);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.contentWrapper}
      extraScrollHeight={80}
      enableOnAndroid
    >
      <View style={styles.steps}>
        <Text
          {...accessibility(
            {
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.title}
        >
          {activity?.name}
        </Text>
        <WizardSteps currentStep={2} numberOfSteps={3} />
      </View>
      <View style={styles.content}>
        <FormProvider {...formMethods}>
          <View style={styles.formContainer}>
            {activity?.id === 9 ? ( <Text
              {...accessibility(
                {
                  role: 'text'
                },
                { accessible: true }
              )}
              style={styles.caption}
            >
             Introduce tu teléfono para que una persona voluntaria pueda contactarte.
            </Text>) : ( <Text
              {...accessibility(
                {
                  role: 'text'
                },
                { accessible: true }
              )}
              style={styles.caption}
            >
              Escribe la dirección a la que tiene que dirigirse la persona
              voluntaria (no indicar nunca teléfono).
            </Text>)}
           
            <Controller
              name='direction'
              control={control}
              render={({ value, onChange }) => (
                <>
                  <TextArea
                    {...accessibility({}, { accessible: true })}
                    style={styles.address}
                    value={value}
                    lines={8}
                    maxLength={120}
                    error={errors?.direction?.message}
                    onChangeText={onChange}
                  />
                  {!errors?.direction?.message && (
                    <ResumeCharacters text={value} maxLength={120} />
                  )}
                </>
              )}
            />
          </View>
        </FormProvider>
      </View>
      <View style={styles.actions}>
        <Actions
          backButtonAction={() => goPrevious?.()}
          nextButtonAction={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Step4;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    contentWrapper: {
      flexGrow: 1,
      backgroundColor: theme.bgSecondary
    },
    steps: {},
    content: {
      flexGrow: 1,
      justifyContent: 'space-evenly',
      paddingHorizontal: 16
    },
    actions: {
      paddingTop: 32,
      paddingBottom: 32,
      paddingHorizontal: 16
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: 25,
      lineHeight: 38,
      marginBottom: 16,
      paddingHorizontal: 60,
      textAlign: 'center'
    },
    formContainer: {
      flex: 1
    },
    caption: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      lineHeight: 24,
      marginBottom: 28,
      paddingHorizontal: 8
    },
    address: {
      maxHeight: 150
    }
  });
