import { inspect, encode, decode as decodeGeneric } from './codec.mjs';

const one = {
  6: 'DELETE FILE (self)',
  5: 'TERMINATE CARD USAGE (MF), TERMINATE DF',
  4: 'ACTIVATE FILE',
  3: 'DEACTIVATE FILE',
  2: 'CREATE FILE (DF creation)',
  1: 'CREATE FILE (EF creation)',
  0: 'DELETE FILE (child)',
};

const more = [
  {
    5: 'TERMINATE CARD USAGE (MF), TERMINATE DF',
    4: 'ACTIVATE FILE',
    3: 'DEACTIVATE FILE',
    2: 'CREATE FILE (DF creation)',
    1: 'CREATE FILE (EF creation)',
    0: 'DELETE FILE (child)',
  },
  {
    5: 'DELETE FILE (self)',
    4: 'APPLICATION MANAGEMENT REQUEST',
    3: 'REMOVE APPLICATION',
    2: 'RFU',
    1: 'RFU',
    0: 'RFU',
  },
  {
    5: 'RFU',
    4: 'RFU',
    3: 'RFU',
    2: 'RFU',
    1: 'command creating data objects (see ISO/IEC 7816-9)',
    0: 'DELETE DATA',
  },
];

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
      more: {
        bitmap: more,
        proprietary,
      },
    },
  });
}
