import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { RADIUS } from '@client/ui-components/src/theme/global';
import { BuildStyles, useTheme } from '@client/ui-components/src/utils';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

type CameraControlProps = {
  isCameraReady: boolean;
  onSwitchCamera: () => void;
  onTakePicture: () => void;
};

const CameraControl = ({
  isCameraReady,
  onSwitchCamera,
  onTakePicture
}: CameraControlProps) => {
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const { accessibility } = useAccessibilityAutoFocus();

  return (
    <View style={styles.control}>
      <TouchableOpacity
        {...accessibility(
          {
            label: 'Cambiar cámara',
            role: 'button',
            state: { disabled: !isCameraReady }
          },
          { accessible: true }
        )}
        style={styles.changeCamera}
        disabled={!isCameraReady}
        onPress={onSwitchCamera}
      >
        <Text style={styles.text}>Cambiar cámara</Text>
      </TouchableOpacity>
      <TouchableOpacity
        {...accessibility(
          {
            label: 'Hacer foto',
            role: 'button',
            state: { disabled: !isCameraReady }
          },
          { accessible: true }
        )}
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onPress={onTakePicture}
        style={styles.capture}
      />
    </View>
  );
};

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    control: {
      position: 'absolute',
      flexDirection: 'row',
      bottom: 0,
      width: '100%',
      height: 120,
      alignItems: 'center',
      justifyContent: 'center'
    },
    capture: {
      backgroundColor: '#f5f6f5',
      height: captureSize,
      width: captureSize,
      borderRadius: Math.floor(captureSize / 2),
      marginHorizontal: 31,
      borderWidth: 1,
      borderColor: theme.bgTertiary
    },
    changeCamera: {
      backgroundColor: theme.bgTertiary,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: RADIUS.S
    },
    text: {
      color: theme.fontColorNegative,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      height: 48,
      lineHeight: 48,
      textAlignVertical: 'center'
    }
  });

export default CameraControl;
