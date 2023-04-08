import * as Linking from 'expo-linking';

export const makeCall = (telephone: string) =>
  Linking.openURL(`tel:${telephone}`);
