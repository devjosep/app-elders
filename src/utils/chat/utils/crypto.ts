import CryptoES from 'crypto-es';
import * as SecureStore from 'expo-secure-store';

import { getDeviceUniqueId } from '../../utils/device';

const getCrytpKey = async (): Promise<string> => {
  const cryptokey = 'cryptokey';
  let cryptoValue = null;
  try {
    cryptoValue = await SecureStore.getItemAsync(cryptokey);
  } catch (error) {
    await SecureStore.deleteItemAsync(cryptokey);
  }

  if (!cryptoValue) {
    cryptoValue = await getDeviceUniqueId();
    await SecureStore.setItemAsync(cryptokey, cryptoValue);
  }
  return cryptoValue;
};

const encrypt = (data: string, key: string): string => {
  return CryptoES.AES.encrypt(data, key).toString();
};

const decrypt = (data: string, key: string): string => {
  return CryptoES.AES.decrypt(data, key).toString(CryptoES.enc.Utf8);
};

export { getCrytpKey, encrypt, decrypt };
