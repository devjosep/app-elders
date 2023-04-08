import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import { NavigationAction, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

import { useAccessibilityAutoFocus } from '@client/common';
import { CustomBackdropModal } from '@client/ui-components/src/components';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import IconClose from 'icons/close.svg';

const MODAL_DELAY = 100;

type PromptProps = {
  promptConfirm?: () => void;
};

const Prompt = ({ promptConfirm }: PromptProps): ReactElement => {
  const modalRef = useRef<Text>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [goBackAction, setGoBackAction] = useState<
    NavigationAction | undefined
  >(undefined);

  const navigation = useNavigation();
  const { accessibility, focusOnElement } = useAccessibilityAutoFocus();

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const handleHideModal = () => setShowDialog(false);
  const handleConfirm = () => {
    handleHideModal();
    promptConfirm?.();
    navigation.dispatch(goBackAction as NavigationAction);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      setGoBackAction(e.data.action);
      setShowDialog(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setTimeout(() => focusOnElement(modalRef), MODAL_DELAY);
  });

  return (
    <Modal
      accessibilityViewIsModal
      isVisible={showDialog}
      useNativeDriver
      customBackdrop={<CustomBackdropModal />}
      style={styles.wizardModal}
    >
      <View style={styles.wizardModalContent}>
        <View style={styles.wizardModalClose}>
          <TouchableOpacity
            {...accessibility(
              {
                label: 'Cerrar alerta',
                hint: 'Cerrar alerta e ir al registro de petición',
                role: 'button'
              },
              { accessible: true }
            )}
            onPress={handleHideModal}
            style={styles.btnClose}
          >
            <IconClose width={48} height={48} style={styles.iconClose} />
          </TouchableOpacity>
        </View>
        <Text
          {...accessibility(
            {
              label: 'Alerta: ¡Atención!'
            },
            { accessible: true }
          )}
          ref={modalRef}
          style={styles.wizardModalTitle}
        >
          ¡Atención!
        </Text>
        <ScrollView>
          <Text
            {...accessibility(
              {
                label: 'Estás a punto de salir de una petición de ayuda.',
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.wizardModalParagraph}
          >
            Estás a punto de salir de una petición de ayuda.
          </Text>
          <Text
            {...accessibility(
              {
                label:
                  'Si sales, los datos no se guardarán y tu petición no se pondrá en marcha.',
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.wizardModalParagraph}
          >
            Si sales, los datos no se guardarán y tu petición no se pondrá en
            marcha.
          </Text>
          <Text
            {...accessibility(
              {
                label: '¿Seguro que deseas salir de la petición?',
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.wizardModalParagraph}
          >
            ¿Seguro que deseas salir de la petición?
          </Text>
        </ScrollView>
        <View style={styles.wizardModalFooter}>
          <View style={[styles.wizardModalFooterItem, { marginRight: 24 }]}>
            <Button
              {...accessibility(
                {
                  label: 'No',
                  hint: 'Cerrar alerta e ir al registro de petición',
                  role: 'button'
                },
                { accessible: true }
              )}
              text='No'
              variant='secondary-modal'
              onPress={handleHideModal}
            />
          </View>
          <View style={styles.wizardModalFooterItem}>
            <Button
              {...accessibility(
                {
                  label: 'Si',
                  hint: 'Salir del registro de petición',
                  role: 'button'
                },
                { accessible: true }
              )}
              onPress={handleConfirm}
              variant='negative'
              text='Si'
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export { Prompt };

const buildStyles = ({ theme, constants: { RADIUS, FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    wizardModal: {
      justifyContent: 'flex-start',
      marginTop: 42
    },
    wizardModalContainer: {
      flexDirection: 'column'
    },
    wizardModalClose: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    wizardModalContent: {
      flexShrink: 1,
      borderRadius: RADIUS.L,
      padding: 24,
      backgroundColor: theme.bgAccent
    },
    wizardModalFooter: {
      flexDirection: 'row',
      paddingVertical: 24
    },
    wizardModalFooterItem: {
      flexGrow: 1
    },
    wizardModalTitle: {
      color: theme.fontColorNegative,
      fontFamily: FF.bold,
      fontSize: FS.XL,
      paddingBottom: 12
    },
    wizardModalParagraph: {
      color: theme.fontColorNegative,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      paddingBottom: 24
    },
    btnIcon: {
      color: theme.fontColorBase,
      marginTop: 8
    },
    iconClose: {
      color: theme.fontColorNegative,
      marginBottom: 8
    },
    btnClose: {
      marginLeft: 'auto'
    }
  });
