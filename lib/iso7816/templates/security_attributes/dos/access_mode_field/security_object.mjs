import { inspect, encode, decode as decodeGeneric } from './codec.mjs';

const one = {
  6: 'RFU',
  5: 'TERMINATE (operation)',
  4: 'ACTIVATE (operation)',
  3: 'DEACTIVATE (operation)',
  2: 'RFU',
  1: 'PUT/UPDATE (operation)',
  0: 'GET (operation)',
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
