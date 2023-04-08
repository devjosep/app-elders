import React, { ReactElement, useEffect, useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

import { useAccessibilityAutoFocus } from '@client/common';
import { CustomBackdropModal } from '@client/ui-components/src/components';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import BtnIcon from 'icons/chevronRight.svg';
import IconClose from 'icons/close.svg';

const MODAL_DELAY = 100;

interface InitialWizardModalProps {
  onClose: () => void;
}

const InitialWizardModal = ({
  onClose
}: InitialWizardModalProps): ReactElement => {
  const modalRef = useRef<Text>(null);

  const { accessibility, focusOnElement } = useAccessibilityAutoFocus();

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  useEffect(() => {
    setTimeout(() => focusOnElement(modalRef), MODAL_DELAY);
  });

  return (
    <Modal
      accessibilityViewIsModal
      isVisible
      useNativeDriver
      customBackdrop={<CustomBackdropModal />}
      style={styles.wizardModal}
    >
      <View style={styles.wizardModalContent}>
        <TouchableOpacity
          {...accessibility(
            { label: 'Cerrar alerta', role: 'button' },
            { accessible: true }
          )}
          style={styles.wizardModalClose}
          onPress={onClose}
        >
          <IconClose width={48} height={48} style={styles.iconClose} />
        </TouchableOpacity>
        <Text
          {...accessibility(
            {
              label: 'Alerta abierta: Aviso importante:'
            },
            { accessible: true }
          )}
          ref={modalRef}
          style={styles.wizardModalTitle}
          accessibilityRole='text'
          numberOfLines={2}
          lineBreakMode='tail'
        >
          Aviso importante:
        </Text>
        <ScrollView contentContainerStyle={styles.wizardModalText}>
          <Text
            {...accessibility(
              {
                label:
                  'Todas las peticiones deben hacerse con al menos 2 días de antelación de lunes a viernes.'
              },
              { accessible: true }
            )}
            style={styles.wizardModalParagraph}
          >
           Todas las peticiones deben hacerse con al menos 2 días de antelación de lunes a viernes. En caso de ser acompañamiento digital  son 3  días de antelación
            de lunes a viernes.
          </Text>
          <Text
            {...accessibility(
              {
                label:
                  'Las peticiones realizadas durante el fin de semana se atenderán a partir del lunes.'
              },
              { accessible: true }
            )}
            style={styles.wizardModalParagraph}
          >
            Las peticiones realizadas durante el fin de semana se atenderán a
            partir del lunes.
          </Text>
        </ScrollView>
        <View style={styles.button}>
          <Button
            {...accessibility(
              { label: 'Continuar', hint: 'Cerrar alerta' },
              { accessible: true }
            )}
            text='Continuar'
            variant='negative'
            onPress={onClose}
          >
            <BtnIcon width={28} height={28} style={styles.btnIcon} />
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export { InitialWizardModal };

const buildStyles = ({ theme, constants: { RADIUS, FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    wizardModal: {
      flex: 1,
      justifyContent: 'flex-start',
      marginHorizontal: 20,
      marginVertical: 40
    },
    wizardModalContent: {
      flexShrink: 1,
      borderRadius: RADIUS.L,
      padding: 24,
      backgroundColor: theme.bgAccent
    },
    wizardModalClose: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 8
    },
    wizardModalTitle: {
      color: theme.fontColorNegative,
      fontFamily: FF.bold,
      fontSize: FS.XL,
      paddingBottom: 12
    },
    wizardModalText: {
      flexGrow: 1,
      marginTop: 10
    },
    button: {
      marginTop: 30,
      justifyContent: 'center'
    },
    wizardModalParagraph: {
      color: theme.fontColorNegative,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      paddingBottom: 24
    },
    btnIcon: {
      color: theme.fontColorBase
    },
    iconClose: {
      color: theme.fontColorNegative
    }
  });
