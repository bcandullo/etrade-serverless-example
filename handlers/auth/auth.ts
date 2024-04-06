import { exec } from 'child_process';

import { APIEvent, APIResponse } from '../../types';
import { getAccessTokenURL, getRequestTokenURL } from '../../etrade';
import { parseBody, Response } from '../../utils';

/**
 * Gets access token and secret from etrade.
 *
 * @example
 *
 * Step 1
 * curl -X POST http://localhost:8000/auth
 *
 * Step 2
 * curl -d '{"code":"HZC0G","key":"__KEY__","secret":"__SECRET__"}' -H "Content-Type: application/json" -X POST http://localhost:8000/auth
 *
 *
 * Step 3
 * curl -d '{"accessToken":"__TOKEN__","accessSecret":"__SECRET__="}' -X POST http://localhost:8000/get-accounts
 *
 */
export const handler = async (event: APIEvent): APIResponse => {
  try {
    const { code, key, secret, accessToken, accessSecret } = parseBody<{
      code: string;
      key: string;
      secret: string;
      accessToken: string;
      accessSecret: string;
    }>(event);

    // No auth params exist, need to auth
    if (!code && !key && !secret && !accessToken) {
      const data = await getRequestTokenURL();

      try {
        exec(
          `osascript -e 'tell application "Google Chrome" to open location "${data.url}"'`,
        );
      } catch (err) {}

      return Response.success(data);
    }

    if (!key || !secret || !code) {
      return Response.badRequest();
    }

    // Save access token
    if (!accessToken || !accessSecret) {
      const url = await getAccessTokenURL(key, secret, code);
      return Response.success({ url });
    }

    return Response.success({ accessToken, accessSecret });
  } catch (err: any) {
    return Response.error(err?.message || 'Error');
  }
};
