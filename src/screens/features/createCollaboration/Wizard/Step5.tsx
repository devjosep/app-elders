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

import { WizardStepProps, step5ValidationSchema, step5ValidationSchemadigi } from '../domain';
import { Actions } from '../shared/Actions';
import { WizardSteps } from 'features/createCollaboration/shared/WizardSteps';
import { useWizardStatus } from 'stores/wizardStore';

type Step5FormModel = {
  additionalData: string;
};

const Step5 = ({ goNext, goPrevious }: WizardStepProps) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();
  const { activity, additionalData, setAdditionalData } = useWizardStatus(
    ({ activity, additionalData, setAdditionalData }) => ({
      activity,
      additionalData,
      setAdditionalData
    })
  );

  const formMethods = 
   activity?.id == 9 ?   useForm<Step5FormModel>({
    resolver: yupResolver(step5ValidationSchemadigi()),
    defaultValues: { additionalData }
  }) :   useForm<Step5FormModel>({
    resolver: yupResolver(step5ValidationSchema()),
    defaultValues: { additionalData }
  });

  const { control, handleSubmit, errors } = formMethods;

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const onSubmit = (data: Step5FormModel) => {
    setAdditionalData(data.additionalData);
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
    <View>
      {activity?.id === 9  ? (  <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.contentWrapper}
      extraScrollHeight={80}
      enableOnAndroid
    >
      <View>
        <Text
          {...accessibility(
            {
              label: activity?.name,
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.title}
        >
          {activity?.name}
        </Text>
        <WizardSteps currentStep={3} numberOfSteps={3} />
      </View>
      <View style={styles.content}>
        <FormProvider {...formMethods}>
          <View style={styles.formContainer}>
            <Text
              {...accessibility(
                {
                  role: 'text'
                },
                { accessible: true }
              )}
              style={styles.caption}
            >
              Por favor, escribe a continuación en qué tipo de trámite concreto necesitas el apoyo.
            </Text>
            <Controller
              name='additionalData'
              control={control}
              render={({ value, onChange }) => (
                <>
                  <TextArea
                    style={styles.indications}
                    value={value}
                    lines={8}
                    maxLength={150}
                    placeholder='Escribir aquí el tipo de trámite concreto que necesitas'
                    error={errors?.additionalData?.message}
                    onChangeText={onChange}
                  />
                  {!errors?.additionalData?.message && (
                    <ResumeCharacters text={value} maxLength={150} />
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
    </KeyboardAwareScrollView>): (  <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.contentWrapper}
      extraScrollHeight={80}
      enableOnAndroid
    >
      <View>
        <Text
          {...accessibility(
            {
              label: activity?.name,
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.title}
        >
          {activity?.name}
        </Text>
        <WizardSteps currentStep={3} numberOfSteps={3} />
      </View>
      <View style={styles.content}>
        <FormProvider {...formMethods}>
          <View style={styles.formContainer}>
            <Text
              {...accessibility(
                {
                  role: 'text'
                },
                { accessible: true }
              )}
              style={styles.caption}
            >
              ¿Necesitas darle alguna indicación más a la persona voluntaria?
              Puedes escribirla a continuación sin dar datos personales ni tu
              teléfono. Describe con más detalle el tipo de colaboración que
              solicitas.
            </Text>
            <Controller
              name='additionalData'
              control={control}
              render={({ value, onChange }) => (
                <>
                  <TextArea
                    style={styles.indications}
                    value={value}
                    lines={8}
                    maxLength={150}
                    placeholder='Escribir aquí las indicaciones'
                    error={errors?.additionalData?.message}
                    onChangeText={onChange}
                  />
                  {!errors?.additionalData?.message && (
                    <ResumeCharacters text={value} maxLength={150} />
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
    </KeyboardAwareScrollView>) }
  
    </View>
  );
};

export default Step5;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    contentWrapper: {
      flexGrow: 1,
      backgroundColor: theme.bgSecondary
    },
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
    indications: {
      maxHeight: 150
    }
  });
