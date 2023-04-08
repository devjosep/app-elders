import { useState, useCallback, useRef } from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  AccessibilityRole,
  Platform,
  AccessibilityState
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useAppStateActions } from '../../chat';
import { useAccessibilityService } from '../services';

/**
 * Look like there is timing issue with AccessibilityInfo.setAccessibilityFocus
 * Ref https://github.com/react-native-community/discussions-and-proposals/issues/118
 */
const AUTO_FOCUS_DELAY = 500;
const ANNOUNCE_DELAY = 500;

export type ImportantForAccessibilityType =
  | 'auto'
  | 'yes'
  | 'no'
  | 'no-hide-descendants';

type Accessibility = {
  label?: string;
  hint?: string;
  role?: AccessibilityRole;
  state?: AccessibilityState;
};

type AccessibilityOptions = {
  autoFocus?: boolean;
  accessible?: boolean;
  importantForAccessibility?: ImportantForAccessibilityType;
  accessibilityElementsHidden?: boolean;
};

/**
 * Remember to add `accessible={true}` to target component
 * @returns [Auto focus ref]
 */
export const useAccessibilityAutoFocus = () => {
  const accessibilityAutofocus = useRef<Accessibility | undefined>(undefined);
  const [appActive, setAppActive] = useState(true);
  const autoFocusRef = useRef<any>(null);

  const { isScreenReaderEnabled } = useAccessibilityService();

  const focusOnElement = (elementRef: any) => {
    if (isScreenReaderEnabled) {
      setTimeout(() => {
        const node = findNodeHandle(elementRef.current);

        if (!node) {
          return;
        }
        // Attempt to call it again just in case AccessibilityInfo.setAccessibilityFocus is delayed
        AccessibilityInfo.setAccessibilityFocus(node);

        if (Platform.OS === 'android')
          AccessibilityInfo.setAccessibilityFocus(node);
      }, AUTO_FOCUS_DELAY);
    }
  };

  const refocusOnElement = () => {
    if (autoFocusRef && autoFocusRef.current) {
      focusOnElement(autoFocusRef);
    }
  };

  const announceForAccessibility = (label: string) => {
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(label);
    }, ANNOUNCE_DELAY);
  };

  const accessibility = (
    data: Accessibility,
    options?: AccessibilityOptions
  ) => {
    const { label, role, hint, state } = data;
    const {
      autoFocus,
      accessible,
      accessibilityElementsHidden,
      importantForAccessibility
    } = options || {};

    if (
      options?.autoFocus &&
      accessibilityAutofocus.current &&
      accessibilityAutofocus.current.label !== data.label
    ) {
      refocusOnElement();
    }

    if (options?.autoFocus) {
      accessibilityAutofocus.current = data;
    }

    return {
      ref: autoFocus ? autoFocusRef : null,
      accessible,
      accessibilityLabel: label,
      accessibilityRole: role,
      accessibilityHint: hint,
      accessibilityState: state,
      accessibilityElementsHidden,
      importantForAccessibility
    };
  };

  useAppStateActions({
    onBackground: () => {
      setAppActive(false);
    },
    onActiveFromBackground: () => {
      setAppActive(true);
    }
  });

  useFocusEffect(
    useCallback(() => {
      if (
        autoFocusRef &&
        autoFocusRef.current &&
        isScreenReaderEnabled &&
        appActive
      ) {
        focusOnElement(autoFocusRef);
      }
    }, [autoFocusRef, isScreenReaderEnabled, appActive])
  );

  return {
    accessibility,
    focusOnElement,
    refocusOnElement,
    announceForAccessibility
  };
};
