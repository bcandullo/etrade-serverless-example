import { ETrade } from 'e-trade-api';

import { ETRADE_KEY, ETRADE_SECRET } from './config';

export const etrade = new ETrade({
  key: ETRADE_KEY,
  secret: ETRADE_SECRET,
  mode: 'prod',
});
