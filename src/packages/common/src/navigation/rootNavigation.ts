import { createRef } from 'react';

import { NavigationContainerRef } from '@react-navigation/core';
import { MutableRefObject } from 'react-native/node_modules/@types/react';

const isReadyRef = createRef<boolean>() as MutableRefObject<boolean>;

const navigationRef = createRef<NavigationContainerRef>();

const navigate = (name: string, params?: object) => {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    // Navigation not ready yet
  }
};

export { isReadyRef, navigationRef, navigate };
