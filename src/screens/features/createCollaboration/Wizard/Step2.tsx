import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageRequireSource,
  ScrollView
} from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { WizardStepProps } from '../domain';
import { Actions } from '../shared/Actions';
import { useWizardStatus } from 'stores/wizardStore';


const IMAGE_MAP_INDEX_DEFAULT = 1;

const IMAGE_MAP: Record<number, ImageRequireSource> = {
  1: require('../../../assets/images/collaborations/acomp-cita-medica.png'),
  2: require('../../../assets/images/collaborations/paseo.png'),
  3: require('../../../assets/images/collaborations/compras.png'),
  4: require('../../../assets/images/collaborations/gestiones.png'),
  5: require('../../../assets/images/collaborations/mascotas.png'),
  6: require('../../../assets/images/collaborations/ocio.png'),
  7: require('../../../assets/images/collaborations/acomp-hospital.png'),
  9: require('../../../assets/images/collaborations/DigitalCompany.png')
};

type Step2Props = {
  digitalCompany: () => void;
} & WizardStepProps;
const Step2 = ({ goNext, goPrevious ,digitalCompany}: Step2Props) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const activity = useWizardStatus((x) => x.activity);

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <View
        {...accessibility({ role: 'none' }, { accessible: false })}
        style={styles.imageWrapper}
      >
        <Image
          style={styles.image}
          source={IMAGE_MAP[activity?.id ?? IMAGE_MAP_INDEX_DEFAULT]}
        />
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.textWrapper}>
          <Text
            {...accessibility({ label: activity?.name }, { accessible: true })}
            style={styles.title}
          >
            {activity?.name}
          </Text>
          <Text
            {...accessibility(
              { label: activity?.description },
              { accessible: true }
            )}
            style={styles.description}
          >
            {activity?.description}
          </Text>
        </View>
        <View style={styles.actionContainer}>
          
          <Actions
            
            backButtonAction={() => goPrevious?.()}
            nextButtonAction={() => goNext?.()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Step2;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    scrollViewContainer: {
      flexGrow: 1,
      paddingBottom: 32
    },
    imageWrapper: {
      flex: 0.8
    },
    contentWrapper: {
      flex: 0.2,
      paddingHorizontal: 16
    },
    textWrapper: {
      justifyContent: 'flex-end',
      flex: 0.75,
      marginBottom: 45
    },
    actionContainer: {
      flex: 0.25,
      justifyContent: 'flex-end'
    },
    image: {
      width: 322,
      height: 322,
      alignSelf: 'center'
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: 26,
      lineHeight: 39,
      paddingBottom: 16
    },
    description: {
      fontFamily: FF.regular,
      color: theme.fontColorBase,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      lineHeight: 24
    }
  });
