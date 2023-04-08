import Constants from 'expo-constants';

import { useAuth } from '../authentication';
import { HttpStatusCodes } from './httpStatusCodes';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Fetcher<TRequest, TQueryString> = {
  url: string;
  method: Method;
  request?: TRequest;
  queryString?: TQueryString;
  token?: string;
  headers?: Record<string, string>;
  withStringify?: boolean;
  apiVersion?: number;
};

const { serviceUrl, apiVersion: apiVersionByConfig } =
  Constants?.manifest!.extra!;

export const doFetch = async <
  TRequest = null,
  TResponse = void,
  TQueryString = void
>({
  url,
  method,
  request,
  queryString,
  token,
  headers = {},
  withStringify = true,
  apiVersion
}: Fetcher<TRequest, TQueryString>): Promise<TResponse> => {
  const tokenToUse = token ?? (await useAuth.getState().getToken());

  const query = new URLSearchParams();
  query.append('api-version', apiVersion ?? apiVersionByConfig);
  if (queryString) {
    Object.entries(queryString).forEach(([key, value]) => {
      query.append(key, value);
    });
  }

  const finalUrl = `${serviceUrl}/api/${url}?${query.toString()}`;

  return fetch(finalUrl, {
    method,
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${tokenToUse}`,
      'Content-Type': 'application/json',
      ...headers
    },
    body: request
      ? withStringify
        ? JSON.stringify(request)
        : (request as unknown as BodyInit)
      : undefined
  }).then(async (response) => {
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      return contentType && contentType.indexOf('application/json') !== -1
        ? await response.json()
        : null;
    } else {
      const result = await response.json();
      if (
        [
          HttpStatusCodes.PreconditionFailed,
          HttpStatusCodes.Unauthorized,
          HttpStatusCodes.Forbidden
        ].includes(response.status)
      ) {
        useAuth.getState().setIsTokenExpired(true);
      } else {
        if (result?.message) {
          throw new Error(result?.message);
        } else if (result?.detail) {
          throw new Error(result?.detail);
        } else if (result?.errors) {
          throw new Error(JSON.stringify(result?.errors));
        } else {
          useAuth.getState().setIsFetcherError(true);
        }
      }
    }
  });
};
