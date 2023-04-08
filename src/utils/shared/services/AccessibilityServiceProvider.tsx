import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  Context,
  PropsWithChildren
} from 'react';
import { AccessibilityInfo } from 'react-native';

interface AccessibilityServiceContextProps {
  isScreenReaderEnabled: boolean;
}

const AccessibilityServiceContext = React.createContext<
  Partial<AccessibilityServiceContextProps>
>({}) as Context<AccessibilityServiceContextProps>;

export const AccessibilityServiceProvider = ({
  children
}: PropsWithChildren<unknown>) => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState<
    AccessibilityServiceContextProps['isScreenReaderEnabled']
  >(false);

  useEffect(() => {
    const handleScreenReaderToggled = (screenReaderEnabled: boolean) => {
      setScreenReaderEnabled(screenReaderEnabled);
    };
    // for initial app start
    AccessibilityInfo.isScreenReaderEnabled()
      .then((enabled) => {
        setScreenReaderEnabled(enabled);
      })
      .catch(() => {
        setScreenReaderEnabled(false);
      });
    AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      handleScreenReaderToggled
    );
    return () => {
      AccessibilityInfo.removeEventListener(
        'screenReaderChanged',
        handleScreenReaderToggled
      );
    };
  }, []);

  const props = useMemo(
    () => ({ isScreenReaderEnabled: screenReaderEnabled }),
    [screenReaderEnabled]
  );

  return (
    <AccessibilityServiceContext.Provider value={props}>
      {children}
    </AccessibilityServiceContext.Provider>
  );
};

export const useAccessibilityService = () =>
  useContext(AccessibilityServiceContext);
