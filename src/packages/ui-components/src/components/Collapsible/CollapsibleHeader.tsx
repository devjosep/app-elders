import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleProp,
  TextStyle,
  Animated,
  Easing,
  StyleSheet
} from 'react-native';

import ChevronDownIcon from '../../../assets/icons/chevronDown.svg';

const ROTATE_ICON_DURATION = 200;

type CollapsibleHeaderProps = {
  title: string;
  isActive: boolean;
  headerStyle?: StyleProp<TextStyle>;
};

const CollapsibleHeader = ({
  title,
  isActive,
  headerStyle
}: CollapsibleHeaderProps) => {
  const animationRotate = useRef(new Animated.Value(0)).current;

  const spin = animationRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg']
  });

  useEffect(() => {
    if (isActive) {
      Animated.timing(animationRotate, {
        toValue: 1,
        duration: ROTATE_ICON_DURATION,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(animationRotate, {
        toValue: 0,
        duration: ROTATE_ICON_DURATION,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <Text style={headerStyle}>{title}</Text>
      <Animated.View
        style={[
          {
            transform: [{ rotate: spin }]
          },
          styles.icon
        ]}>
        <ChevronDownIcon width={20} height={20} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    marginLeft: 5,
    alignItems: 'center'
  }
});

export { CollapsibleHeader };
