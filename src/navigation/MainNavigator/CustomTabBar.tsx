import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import {
  BottomTabBarProps,
  BottomTabBarOptions
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import { useTheme, BuildStyles } from '@client/ui-components/src/utils';
import { useAccessibilityAutoFocus } from '@client/common';

const CustomTabBar = ({
  state,
  descriptors,
  navigation
}: BottomTabBarProps<BottomTabBarOptions>) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();

  const styles = buildStyles({ role, theme, constants });

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            {...accessibility(
              {
                label: options.tabBarAccessibilityLabel,
                hint: `Ir a ${options.tabBarAccessibilityLabel}`,
                role: 'menuitem',
                state: { selected: isFocused }
              },
              { accessible: true }
            )}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.touchArea}
          >
            {options.tabBarIcon
              ? options.tabBarIcon({ focused: isFocused, color: '', size: 0 })
              : null}
            <Text
              style={[styles.touchAreaText, isFocused ? styles.isSelected : {}]}
              numberOfLines={1}
              lineBreakMode='tail'
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export { CustomTabBar };

const buildStyles = ({ theme, constants: { FS, FF } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      borderTopColor: theme.fontColorBase,
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 100
    },
    touchArea: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
    },
    touchAreaText: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.M,
      lineHeight: 24,
      height: 24
    },
    isSelected: {
      color: theme.secondary
    }
  });
