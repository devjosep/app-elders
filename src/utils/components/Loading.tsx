import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle
} from 'react-native';

import { useTheme } from '@client/ui-components/src/utils/useTheme';

type LoadingProps = {
  style?: StyleProp<ViewStyle>;
  color?: string;
};

const Loading = ({ style, color }: LoadingProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.loadingView, style]}>
      <ActivityIndicator size='large' color={color ? color : theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export { Loading };
