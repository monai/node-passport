import { inspect, encode, decode as decodeGeneric } from './codec.mjs';

const one = {
  6: 'CREATE USER, DELETE USER',
  5: 'GRANT, REVOKE',
  4: 'CREATE TABLE, CREATE VIEW, CREATE DICTIONARY',
  3: 'DROP TABLE, DROP VIEW',
  2: 'INSERT',
  1: 'UPDATE, DELETE',
  0: 'FETCH',
};

const proprietary = 'Proprietary';

export {
  inspect,
  encode,
};

export function decode(data) {
  return decodeGeneric(data, {
    labels: {
      one: {
        bitmap: one,
        proprietary,
      },
    },
  });
}
