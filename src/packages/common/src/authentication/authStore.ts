import create from 'zustand';

import { UserCredentials, UserProfile, UserType } from '../user/domain';
import {
  getCredentialsFromStore,
  removeCredentialsFromStore,
  setCredentialsToStore
} from './credentials/credentialsStore';
import {
  AuthConfig,
  getAccessToken,
  parseClaims
} from './services/authService';

type AuthStoreConfig = {
  authConfig: AuthConfig;
  userType: UserType;
  getUserProfile: (token: string) => Promise<Partial<UserProfile>>;
};

type AuthStore = {
  user: UserProfile;
  userCredentials: UserCredentials;
  config?: AuthStoreConfig;
  isFetcherError: boolean;

  initialize: (config: AuthStoreConfig) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isSessionExpired: () => boolean;
  getToken: () => Promise<string | undefined>;
  updateUser: (name: string, phone: string) => void;
  setIsTokenExpired: (isTokenExpired: boolean) => void;
  setIsFetcherError: (isFetcherError: boolean) => void;
};

const useAuth = create<AuthStore>((set, get) => ({
  user: {} as UserProfile,
  userCredentials: {} as UserCredentials,
  config: undefined,
  isFetcherError: false,
  initialize: async (config: AuthStoreConfig) => {
    set({
      config
    });
    try {
      await get().refreshSession();
    } catch (err) {
      console.log(err);
    }
  },
  signIn: async (username: string, password: string) => {
    const config = get().config!;

    try {
      const response = await getAccessToken(
        config.authConfig,
        username,
        password,
        {
          client: get().config!.userType
        }
      );

      const { user, userCredentials } = parseClaims(response);
      const profile =
        (await config.getUserProfile(response.access_token)) ?? {};

      set({
        user: {
          ...user,
          ...profile
        },
        userCredentials
      });

      await setCredentialsToStore(username, password);
    } catch (error) {
      await get().signOut();
      throw error;
    }
  },
  signOut: async () => {
    await removeCredentialsFromStore();
    const { isTokenExpired } = get().userCredentials;
    const isFetcherError = get().isFetcherError;

    set({
      user: {} as UserProfile,
      userCredentials: { isTokenExpired } as UserCredentials,
      isFetcherError
    });
  },
  refreshSession: async () => {
    const credentials = await getCredentialsFromStore();
    if (credentials) {
      const { username, password } = credentials;
      await get().signIn(username, password);
    }
  },
  isSessionExpired: () => {
    const isTokenExpired = get().userCredentials?.isTokenExpired;
    if (isTokenExpired) {
      return true;
    }

    const tokenExpirationDate = get().userCredentials?.tokenExpirationDate;
    return tokenExpirationDate
      ? new Date().getTime() >= tokenExpirationDate.getTime()
      : false;
  },
  getToken: async () => {
    const isSessionExpired = get().isSessionExpired();

    if (isSessionExpired) {
      try {
        await get().refreshSession();
      } catch (err) {
        get().setIsTokenExpired(true);
      }
    }

    const userCredentials = get().userCredentials;
    return userCredentials?.token;
  },
  updateUser: (name: string, phone: string) => {
    const user = get().user;
    set({
      user: { ...user!, name, phone }
    });
  },
  setIsTokenExpired: (isTokenExpired: boolean) => {
    const userCredentials = get().userCredentials;
    set({
      userCredentials: { ...userCredentials!, isTokenExpired }
    });
  },
  setIsFetcherError: (isFetcherError: boolean) => {
    set({
      isFetcherError
    });
  }
}));

export { useAuth };
