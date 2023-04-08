import { UserCredentials, UserProfile } from '../../user/domain';
import { getExpirationDate } from '../../utils/dates';
import { jwtDecode } from '../../utils/jwt';
import {  postToken, TokenResponse } from './oAuthService';

export type AuthConfig = {
  authorityUrl: string;
  tokenEndpoint: string;
  clientId: string;
  scopes: string[];
};

const getAccessToken = (
  config: AuthConfig,
  username: string,
  password: string,
  extraParams: { [key: string]: string } = {}
): Promise<TokenResponse> => {
  const body = new URLSearchParams();
  body.append('client_id', config.clientId);
  body.append('scope', config.scopes.join(' '));
  body.append('grant_type', 'password');
  body.append('username', username);
  body.append('password', password);
  if (extraParams) {
    for (const key in extraParams) {
      body.append(key, extraParams[key]);
    }
  }
  return postToken(config.authorityUrl, config.tokenEndpoint, body);
};

const parseClaims = (tokenResponse: TokenResponse) => {
  const claims = jwtDecode(tokenResponse.access_token);

  return {
    user: {
      cid360: claims.cid360 ?? '',
      name: claims.name ?? '',
      phone: claims.phone ?? '',
      email: claims.email ?? '',
      userType: claims.role ?? ''
    } as UserProfile,
    userCredentials: {
      token: tokenResponse.access_token ?? '',
      tokenExpirationDate: getExpirationDate(tokenResponse.expires_in ?? 14400),
      isLoggedIn: tokenResponse.access_token !== null
    } as UserCredentials
  };
};

export { getAccessToken, parseClaims };
