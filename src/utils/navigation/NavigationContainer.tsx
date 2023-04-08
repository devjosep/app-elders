import React, { ComponentProps, PropsWithChildren, useEffect } from 'react';

import { NavigationContainer as NativeNavigationContainer } from '@react-navigation/native';

import { isReadyRef, navigationRef } from './rootNavigation';

const NavigationContainer = ({
  children,
  ...restProps
}: PropsWithChildren<ComponentProps<typeof NativeNavigationContainer>>) => {
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <NativeNavigationContainer
      {...restProps}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      {children}
    </NativeNavigationContainer>
  );
};

export { NavigationContainer };
