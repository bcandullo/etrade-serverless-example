import { APIEvent } from '../types';

export const parseBody = <T extends Object>(event: APIEvent): Partial<T> => {
  let parsed = {};
  try {
    parsed = JSON.parse(event.body ?? '') ?? {};
  } catch (err) {}
  return parsed;
};
