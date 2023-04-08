import React, { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityRole,
  Platform
} from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

type RequestItemProps = {
  icon: React.FC;
  onPress: () => void;
  withSeparator?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
};

const Separator = () => <View style={{ height: 28 }} />;

const RequestItem: FC<RequestItemProps> = ({
  children,
  onPress,
  icon: Icon,
  withSeparator = true,
  accessibilityLabel = '',
  accessibilityHint = '',
  accessibilityRole = 'text'
}) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <>
      <TouchableOpacity
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        style={styles.container}
        onPress={onPress}
      >
        <View style={styles.icon}>
          <Icon style={{ color: theme.secondary }} height={35} width={35} />
        </View>
        <View
          {...accessibility(
            {},
            {
              accessibilityElementsHidden: true,
              importantForAccessibility: 'no-hide-descendants'
            }
          )}
          style={styles.titleWrapper}
        >
          <Text
            accessibilityElementsHidden
            importantForAccessibility='no-hide-descendants'
            style={styles.title}
          >
            {children}
          </Text>
        </View>
      </TouchableOpacity>
      {withSeparator ? <Separator /> : null}
    </>
  );
};

export { RequestItem };

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'stretch',
      borderWidth: 2,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderColor: theme.fontColorBase,
      borderRadius: 12
    },
    icon: {
      display: 'flex',
      minWidth: 50,
      justifyContent: 'center'
    },
    titleWrapper: {
      display: 'flex',
      flexShrink: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    },
    title: {
      fontFamily: FF.regular,
      fontSize: FS.LL,
      lineHeight: Platform.OS === 'android' ? 36 : 46,
      letterSpacing: 0.3,
      color: theme.fontColorBase,
      textAlignVertical: 'center',
      flexShrink: 1,
      minHeight: 48
    }
  });
