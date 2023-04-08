export type TokenResponse = {
  id_token?: string;
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
  scope?: string;
};
export let pepe = ""
export type TokenError = {
  error: string;
  error_description?: string;
};

const postToken = async (
  authority: string,
  tokenEndpoint: string,
  body: URLSearchParams
): Promise<TokenResponse> => {
  const response = await fetch(`${authority}${tokenEndpoint}`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });
  const data = await response.json();

  if (response.status !== 200) {
    const error = data as TokenError;
    throw new Error(error?.error_description ?? error?.error);
  }

  return data as TokenResponse;
};

export { postToken};
