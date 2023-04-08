
import React, { useEffect } from 'react';
// import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import 'reflect-metadata';
// import { KeyboardAvoidingView, LogBox, Platform } from 'react-native';
import { LogBox, Platform, Text } from 'react-native';

// import { LoadResources } from 'components/LoadResources';
// import { configuration } from 'configuration';
// import { ErrorBoundary } from 'react-error-boundary';
// import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { QueryClientProvider } from 'react-query';

// import {
//   AccessibilityServiceProvider,
//   ChatConnectionProvider,
//   queryClient
// } from '@client/common';
// import { queryClient } from './src/utils/http';
// import { configureFontScaling } from '@client/ui-components/src/utils';
import { configureFontScaling } from './src/utils';

// import { Error } from './components/Error';
import { Error } from './src/components/Error';

import { MainNavigator as Navigation } from './src/navigation';
import { View } from 'react-native';
// Hack: see: https://github.com/facebook/react-native/issues/12981
// Hack FlatList see: https://forums.expo.io/t/warning-virtualizedlists-should-never-be-nested-inside-plain-scrollviews-with-the-same-orientation-use-another-virtualizedlist-backed-container-instead/31361/5
LogBox.ignoreLogs([
  'Setting a timer',
  'VirtualizedLists should never be nested'
]);

configureFontScaling();

// const { SERVICE_URL } = configuration;
// useEffect(() => {
//   SplashScreen.hide();
// }, [])
const App = () => (
  // <LoadResources>
  <SafeAreaProvider>
    {/* <QueryClientProvider client={queryClient}> */}
    {/* <AccessibilityServiceProvider> */}
    {/* <ChatConnectionProvider serviceUrl={SERVICE_URL}> */}
    {/* <PaperProvider> */}
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* <ErrorBoundary FallbackComponent={Error}> */}
      {/* <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{
                      flex: 1
                    }}
                  > */}
      <Navigation />
      {/* <View><Text>hola</Text></View> */}
      {/* </KeyboardAvoidingView> */}
      {/* </ErrorBoundary> */}
    </SafeAreaView>
    {/* </PaperProvider> */}
    {/* </ChatConnectionProvider> */}
    {/* </AccessibilityServiceProvider> */}
    {/* </QueryClientProvider> */}
  </SafeAreaProvider>
  // </LoadResources>
);

export default App;
