import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { useCachedResources } from 'src/infra/useCachedResources';
import { ThemeProvider } from 'src/utils/ThemeProvider';

import {
  Button,
  Input,
  Loading,
  TextArea,
  RadioButton
} from './src/components';

const App = (): ReactElement | null => {
  const isLoadingComplete = useCachedResources();
  return isLoadingComplete ? (
    <ThemeProvider>
      <View style={styles.container}>
        <Loading />
        <Button text='test' />
        <StatusBar style='light' />
        <Input label='Test Input' placeholder='Inserta texto' />
        <TextArea
          label='Test TextArea'
          placeholder='Inserta texto'
          lines={5}
          value=''
        />
        <RadioButton label='Test' checked key='test' />
      </View>
    </ThemeProvider>
  ) : null;
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  }
});
