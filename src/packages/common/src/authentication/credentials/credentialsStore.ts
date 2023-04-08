import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_STORE_KEY = 'credentials';

const getCredentialsFromStore = async () => {
  const credentials = await SecureStore.getItemAsync(CREDENTIALS_STORE_KEY);
  if (!credentials) {
    return null;
  }
  const { username, password } = JSON.parse(credentials);
  return { username, password };
};

const setCredentialsToStore = async (username: string, password: string) => {
  await SecureStore.setItemAsync(
    CREDENTIALS_STORE_KEY,
    JSON.stringify({ username, password })
  );
};

const removeCredentialsFromStore = async () => {
  await SecureStore.deleteItemAsync(CREDENTIALS_STORE_KEY);
};

export {
  getCredentialsFromStore,
  setCredentialsToStore,
  removeCredentialsFromStore
};
