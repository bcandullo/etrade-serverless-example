## Serverless Etrade Node Example

Detailed information and code examples on obtaining auth tokens from Etrade to make trades and do other account operations.

## Requirements

- MacOS, cURL, Node 20, Etrade account enrolled in API

## Setup

### Build The Typescript

`npm run api:build`

To watch files while developing do `npm run start`

### Start Serverless Offline

`npm run api:offline`

This will spawn nodemon and watch changes to all built Typescript, then reboot the SLS offline server.

The server will run on port 8000 by default.

### Authorize

`curl -X POST http://localhost:8000/auth`

This should launch Chrome to the Etrade login. If it doesn't open the `url` from the response in a browser.

### Login To Etrade, Accept Agreement

An agreement will display, click the 'Accept' button.

A 5-digit code will be revealed, example `PK2Q3`. Use this code in one final cURL request to get the session tokens:

Look at the console log for the green cURL output, find the `__CODE__` line and replace it with the code from above.

It should look something like this:

```
curl -d '{"code":"__CODE__","key":"encoded-key","secret":"encoded-secret"}' -H "Content-Type: application/json" -X POST http://localhost:8000/auth
```

Make that request and voila! You will see an access token and secret in the console, a URL encoded version of each.

```
accessToken iGTRzkPRmzFLBQlz1OF8equpHalI=
url encoded JJVqiGTRzkPRmzFLBQlz1OF8equpHalI%3D
accessSecret X74KlDapHmEPxiOo33ayy6PF/ZjKY=
url encoded bivX74KlDapHmEPxiOo33ayy6PF%2FZjKY%3D
```

## Todo

- [ ] Automatically append tokens to all subseeuqnt requests
- [ ] Automatically login with auth details from .env file
- [ ] Deployment documentation and examples

# --

Example of the fun things you may persue with this.
Just remember: nobody is correct 100%.

TICK SPXL 12:27:22 PM PROD true
TOTAL RETURN 0.0% SPXL
TICK SPXS 12:27:23 PM PROD true
TOTAL RETURN 0.0% SPXS
TICK SQQQ 12:27:24 PM PROD true
TOTAL RETURN 0.0% SQQQ
TICK TQQQ 12:28:21 PM PROD true
TICK SPXL 12:28:22 PM PROD true
TICK SPXS 12:28:24 PM PROD true
TICK SQQQ 12:28:25 PM PROD true
✨ 10:46 AM OPEN LONG POSITION TQQQ @ 59.35 OLD
💚 10:54 AM CLOSE TQQQ O 59.35 C 59.83, 0.81% PRICE_MAX OLD
✨ 11:36 AM OPEN LONG POSITION TQQQ @ 59.89 OLD
💚 11:54 AM CLOSE TQQQ O 59.89 C 60.44, 0.92% PRICE_MAX OLD
TICK SPXL 12:29:22 PM PROD true
✨ 10:14 AM OPEN LONG POSITION SPXL @ 128.36 OLD
💚 10:54 AM CLOSE SPXL O 128.36 C 129.35, 0.77% PRICE_MAX OLD
✨ 11:32 AM OPEN LONG POSITION SPXL @ 129.52 OLD
💚 11:54 AM CLOSE SPXL O 129.52 C 130.75, 0.95% PRICE_MAX OLD
TOTAL RETURN 1.7% TQQQ
