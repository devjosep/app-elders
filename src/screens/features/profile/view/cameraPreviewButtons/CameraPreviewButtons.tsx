import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { Button, Loading } from '@client/ui-components/src/components';
import { useAccessibilityAutoFocus } from '@client/common';

type CameraPreviewButtonsProps = {
  isSaving: boolean;
  cancelPreview: () => void;
  savePhoto: () => void;
};

const CameraPreviewButtons = ({
  isSaving,
  cancelPreview,
  savePhoto
}: CameraPreviewButtonsProps) => {
  const guardarRef = useRef<TouchableWithoutFeedback | null>(null);
  const { accessibility, focusOnElement } = useAccessibilityAutoFocus();

  useEffect(() => {
    if (guardarRef && guardarRef.current) {
      focusOnElement(guardarRef);
    }
  }, [guardarRef]);

  return (
    <View style={styles.preview_actions}>
      {isSaving ? (
        <Loading />
      ) : (
        <View style={styles.preview_actions_buttons}>
          <Button
            {...accessibility(
              {
                label: 'Cancelar',
                hint: 'Volver a hacer una foto',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Cancelar'
            variant='secondary'
            onPress={cancelPreview}
            style={styles.preview_action_button}
          />
          <Button
            {...accessibility(
              {
                label: 'Guardar',
                hint: 'Guardar esta foto como foto de perfil',
                role: 'button'
              },
              { accessible: true }
            )}
            ref={guardarRef}
            text='Guardar'
            variant='primary'
            onPress={savePhoto}
            style={styles.preview_action_button}
          />
        </View>
      )}
    </View>
  );
};

export default CameraPreviewButtons;

const styles = StyleSheet.create({
  preview_actions: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  preview_actions_buttons: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  preview_action_button: {
    flex: 0.48
  }
});
