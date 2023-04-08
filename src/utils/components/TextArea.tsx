import React, {
  useState,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle
} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle
} from 'react-native';

import { useKeyboardStatus } from '@client/common';

import { useTheme, BuildStyles } from '../utils';

type TextAreaProps = {
  disabled?: boolean;
  error?: string;
  label?: string;
  lines?: number;
  maxHeight?: number;
  maxLength?: number;
  multiline?: boolean;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  autofocus?: boolean;
  value: string;
  onChangeText?: (text: string) => void;
};

type TextAreaRef = Partial<TextInput>;

const TextArea = forwardRef(
  (
    {
      disabled,
      error = '',
      label,
      lines,
      maxHeight,
      maxLength,
      multiline = true,
      placeholder = '',
      style,
      autofocus = false,
      value,
      onChangeText
    }: TextAreaProps,
    ref: Ref<TextAreaRef>
  ) => {
    const { theme, role, constants } = useTheme();
    const styles = buildStyles({ role, theme, constants });
    const [isFocused, setIsFocused] = useState(false);
    const hasErrors = error !== '';
    const textInputRef = useRef<TextInput>(null);

    const keyboardOpen = useKeyboardStatus();

    useImperativeHandle(ref, () => textInputRef.current ?? {}, [textInputRef]);

    useEffect(() => {
      if (!keyboardOpen) {
        textInputRef.current?.blur();
      }
    }, [keyboardOpen]);

    return (
      <View style={[styles.inputTextAreaContainer, style]}>
        {label ? (
          <Text
            accessible
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            style={styles.inputLabel}>
            {label}:
          </Text>
        ) : null}
        <TextInput
          ref={textInputRef}
          style={[
            styles.inputTextArea,
            isFocused && styles.inputTextAreaFocused,
            hasErrors === true ? styles.isError : null,
            { maxHeight }
          ]}
          autoFocus={autofocus}
          editable={!disabled}
          textAlignVertical={multiline && lines && lines > 1 ? 'top' : 'center'}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? lines : undefined}
          scrollEnabled
          onChangeText={onChangeText}
          placeholderTextColor={theme.fcInputPlaceholder}
          value={value}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {hasErrors ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

export { TextArea };

const buildStyles = ({
  role,
  theme,
  constants: { RADIUS, FF, FS }
}: BuildStyles) =>
  StyleSheet.create({
    inputTextAreaContainer: {
      flexDirection: 'column',
      flexGrow: 1
    },
    inputLabel: {
      fontSize: role === 'elders' ? FS.XM : FS.M,
      paddingBottom: role === 'elders' ? 16 : 12
    },
    inputTextArea: {
      color: theme.fcInputFocus,
      fontFamily: FF.regular,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      lineHeight: role === 'elders' ? 28 : 26,
      letterSpacing: role === 'elders' ? 0.3 : 0,
      textDecorationLine: 'none',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: RADIUS.XS,
      borderWidth: 2,
      overflow: 'hidden',
      borderColor:
        role === 'elders' ? theme.bcInputElders : theme.bcInputVolunteers,
      backgroundColor: role === 'elders' ? theme.bgDefault : theme.bgSecondary,
      minHeight: 50,
      flexGrow: 1
    },
    inputTextAreaFocused: {
      borderColor: theme.bcInputFocus,
      color: theme.fcInputFocus
    },
    errorText: {
      position: 'absolute',
      color: theme.error,
      fontFamily: FF.regular,
      fontSize: FF.S,
      paddingHorizontal: 8,
      paddingTop: 4,
      textAlign: 'right',
      bottom: -28
    },
    errorIcon: {
      position: 'absolute',
      bottom: 18,
      right: 16,
      color: theme.error
    },
    isError: {
      borderColor: theme.error,
      backgroundColor: theme.bgSecondary
    }
  });
