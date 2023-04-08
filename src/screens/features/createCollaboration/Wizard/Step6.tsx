import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  dateToString,
  dateToTimeString,
  useAccessibilityAutoFocus,
  useAuth
} from '@client/common';
import { Loading } from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import CalendarIcon from '../../../assets/icons/calendar.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import CollaborationIcon from '../../../assets/icons/collaboration.svg';
import InfoIcon from '../../../assets/icons/info.svg';
import PlaceIcon from '../../../assets/icons/place.svg';
import { WizardStepProps } from '../domain';
import { Actions } from '../shared/Actions';
import { RequestItem } from './Step6/RequestItem';
import { useWizardStatus } from 'stores/wizardStore';

type Step6Props = {
  isLoading: boolean;
  onSubmit: () => Promise<void>;
} & WizardStepProps;

const Step6 = ({ isLoading, onSubmit, goPrevious, setStep }: Step6Props) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();
  const user = useAuth((state) => state.user);
  const { activity, date, direction, additionalData } = useWizardStatus();

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  useEffect(() => {
    if (isLoading) {
      announceForAccessibility('Registrando');
    }
  }, [isLoading]);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.scrollView}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            {...accessibility(
              {
                label: `Por favor ${user.name}, comprueba que los datos son correctos. Si hay algún error, puedes pulsar "Anterior" para corregirlo.`,
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.title}
          >
            {`Por favor ${user.name}, comprueba que los datos son correctos. Si hay algún error, puedes pulsar "Anterior" para corregirlo.`}
          </Text>
        </View>
        <View style={styles.content}>
          <RequestItem
            {...accessibility(
              {
                label: `Tipo de petición: ${activity?.name}`,
                hint: 'Ir a modificar tipo de petición',
                role: 'button'
              },
              { accessible: true }
            )}
            icon={CollaborationIcon}
            onPress={() => setStep?.(0)}
          >
            {activity?.name}
          </RequestItem>
          <RequestItem
            {...accessibility(
              {
                label: `Fecha: ${dateToString(date)}`,
                hint: 'Ir a modificar fecha',
                role: 'button'
              },
              { accessible: true }
            )}
            icon={CalendarIcon}
            onPress={() => setStep?.(2)}
          >
            {dateToString(date)}
          </RequestItem>
          <RequestItem
            {...accessibility(
              {
                label: `Hora: ${dateToTimeString(date, 'HH:mm')}`,
                hint: 'Ir a modificar hora',
                role: 'button'
              },
              { accessible: true }
            )}
            icon={ClockIcon}
            onPress={() => setStep?.(2)}
          >
            {dateToTimeString(date, 'HH:mm')}
          </RequestItem>
          <RequestItem
            {...accessibility(
              {
                label: `Dirección: ${direction}`,
                hint: 'Ir a modificar dirección',
                role: 'button'
              },
              { accessible: true }
            )}
            icon={PlaceIcon}
            onPress={() => setStep?.(3)}
            withSeparator={additionalData !== ''}
          >
            {direction}
          </RequestItem>

          {additionalData !== '' ? (
            <RequestItem
              {...accessibility(
                {
                  label: `Indicaciones: ${additionalData}`,
                  hint: 'Ir a modificar indicaciones',
                  role: 'button'
                },
                { accessible: true }
              )}
              icon={InfoIcon}
              onPress={() => setStep?.(4)}
              withSeparator={false}
            >
              {additionalData}
            </RequestItem>
          ) : null}
        </View>
        <View style={styles.actionContainer}>
          {isLoading ? (
            <Loading />
          ) : (
            <Actions
              isDisabled={isLoading}
              backButtonAction={() => goPrevious?.()}
              nextButtonAction={onSubmit}
            />
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Step6;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    scrollView: {
      flexGrow: 1,
      paddingBottom: 32,
      backgroundColor: theme.bgSecondary
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: 16
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      lineHeight: 24,
      letterSpacing: 0.3
    },
    titleContainer: {
      paddingHorizontal: 8
    },
    content: {
      flex: 1,
      marginTop: 24
    },
    actionContainer: {
      marginTop: 24,
      justifyContent: 'flex-end'
    }
  });
