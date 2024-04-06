import { writeFile } from 'fs/promises';
import { log } from 'console';
import { green, yellow } from 'cli-color';
import { ETrade } from 'e-trade-api';

import { etrade } from './etrade';

export const setEtradeTokensCheck = (
  etrade: ETrade,
  accessToken?: string,
  accessSecret?: string,
): boolean => {
  if (!accessToken || !accessSecret) {
    return false;
  }
  etrade.settings.accessToken = accessToken;
  etrade.settings.accessSecret = accessSecret;
  return true;
};

export const getRequestTokenURL = async (): Promise<{
  url: string;
  curl: string;
}> => {
  const requestTokenResults = await etrade.requestToken();
  const { url, oauth_token, oauth_token_secret } = requestTokenResults;
  const key = oauth_token;
  const secret = oauth_token_secret;
  const command = `curl -d '{"code":"__CODE__","key":"${key}","secret":"${secret}"}' -H "Content-Type: application/json" -X POST`;
  const curl = `${command} http://localhost:8000/auth`;
  log(green(curl));
  return { url, curl };
};

export const getAccessTokenURL = async (
  key: string,
  secret: string,
  code: string,
): Promise<string> => {
  const accessTokenResults = await etrade.getAccessToken({ key, secret, code });
  const { oauth_token: accessToken, oauth_token_secret: accessSecret } =
    accessTokenResults;
  // Store tokens in local .auth file
  await writeFile(`.auth`, `TOKEN ${accessToken} \nSECRET ${accessSecret}`);
  log(green('accessToken', accessToken));
  log(yellow('url encoded', encodeURIComponent(accessToken)));
  log(green('accessSecret', accessSecret));
  log(yellow('url encoded', encodeURIComponent(accessSecret)));
  const headers = `-H "Content-Type: application/json"`;
  return `curl -d '{"accessToken":"${accessToken}","accessSecret":"${accessSecret}"}' ${headers} -X POST`;
};
