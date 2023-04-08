import { Buffer } from 'buffer';

const decodeBase64 = (value: string) =>
  Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();

const jwtDecode = (token: string | null) => {
  if (!token) {
    return {};
  }
  const [, payload] = token.split('.');

  const payloadBuf = decodeBase64(payload);
  return JSON.parse(payloadBuf.toString());
};

export { jwtDecode };
