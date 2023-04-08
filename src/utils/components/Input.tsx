import React, { Ref, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  KeyboardTypeAndroid,
  KeyboardType,
  TextInputProps,
  ViewStyle,
  StyleProp,
  TouchableOpacity
} from 'react-native';

import { ImportantForAccessibilityType } from '@client/common';

import IconhiddenPassword from '../../assets/icons/hidden-password.svg';
import IconShowPassword from '../../assets/icons/show-password.svg';
import IconWarning from '../../assets/icons/warning.svg';
import { useTheme, BuildStyles } from '../utils';

type InputProps = {
  label: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  value?: string;
  keyboardType?: KeyboardType | KeyboardTypeAndroid;
  accessibleLabel?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
} & Pick<
  TextInputProps,
  | 'returnKeyType'
  | 'onSubmitEditing'
  | 'autoFocus'
  | 'secureTextEntry'
  | 'autoCompleteType'
  | 'maxLength'
  | 'textContentType'
>;

const Input = forwardRef(
  (
    {
      label,
      placeholder,
      onChangeText,
      value,
      keyboardType = 'default',
      accessibleLabel = true,
      error = '',
      style,
      textContentType,
      ...textInputProps
    }: InputProps,
    ref: Ref<TextInput>
  ) => {
    const { theme, role, constants } = useTheme();
    const styles = buildStyles({ role, theme, constants });
    const hasErrors = error !== '';

    const [securePassword, setSecurePassword] = React.useState<boolean>(
      textContentType === 'password'
    );

    const accessibilityLabelOptions = accessibleLabel
      ? { accessible: true }
      : {
          accessible: false,
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants' as ImportantForAccessibilityType
        };

    const IconPassword = securePassword ? IconhiddenPassword : IconShowPassword;

    return (
      <View style={[styles.inputContainer, style]}>
        <Text
          {...accessibilityLabelOptions}
          accessibilityLabel={label}
          style={styles.inputLabel}>
          {label}:
        </Text>
        <View style={styles.inputContent}>
          <TextInput
            ref={ref}
            {...textInputProps}
            accessible
            accessibilityLabel={label}
            style={[
              styles.input,
              hasErrors === true ? styles.hasError : null,
              textContentType === 'password' && styles.inputWithIcon
            ]}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            placeholder={placeholder}
            placeholderTextColor={theme.fontColorAux}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            spellCheck={false}
            textContentType={textContentType}
            secureTextEntry={securePassword}
            value={value}
          />
          {!hasErrors && textContentType === 'password' && (
            <TouchableOpacity
              accessible
              accessibilityLabel={
                securePassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
              style={[
                styles.iconRightWrapper,
                hasErrors && styles.iconRightWrapperWithError
              ]}
              onPress={() => setSecurePassword((oldState) => !oldState)}>
              <IconPassword style={[styles.iconRight]} />
            </TouchableOpacity>
          )}
          {hasErrors ? (
            <IconWarning
              style={styles.iconWarning as never}
              width='24'
              height='24'
            />
          ) : null}
        </View>
        {hasErrors ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

export { Input };

const buildStyles = ({
  role,
  theme,
  constants: { RADIUS, FF, FS }
}: BuildStyles) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'column',
      position: 'relative'
    },
    inputContent: {
      flexDirection: 'row'
    },
    inputLabel: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      letterSpacing: 0.3,
      lineHeight: 24,
      paddingBottom: role === 'elders' ? 8 : 12,
      paddingHorizontal: 8
    },
    input: {
      flex: 1,
      backgroundColor: theme.bgDefault,
      borderColor: theme.fontColorBase,
      borderRadius: RADIUS.XS,
      borderWidth: 2,
      fontFamily: FF.italic,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      paddingHorizontal: 16,
      paddingVertical: 14,
      textDecorationLine: 'none',
      lineHeight: 28,
      letterSpacing: 0.3
    },
    inputWithIcon: {
      paddingRight: 62
    },
    errorText: {
      color: theme.error,
      fontFamily: FF.regular,
      fontSize: FF.S,
      paddingHorizontal: 8,
      paddingTop: 4,
      textAlign: 'right'
    },
    warningIcon: {
      bottom: 18,
      color: theme.error,
      position: 'absolute',
      right: 16
    },
    hasError: {
      backgroundColor: theme.bgSecondary,
      borderColor: theme.error,
      paddingRight: 46
    },
    iconWarning: {
      position: 'absolute',
      right: 12,
      top: 14,
      fontSize: 24,
      padding: 10,
      margin: 5,
      height: 25,
      width: 30,
      resizeMode: 'stretch',
      alignItems: 'center',
      color: theme.error
    },
    iconRightWrapper: {
      position: 'absolute',
      right: 12,
      top: 14
    },
    iconRightWrapperWithError: {
      right: 38
    },
    iconRight: {
      color: theme.fontColorBase,
      fontSize: 24,
      padding: 10,
      margin: 5,
      height: 25,
      width: 30,
      resizeMode: 'stretch',
      alignItems: 'center'
    }
  });
