import { inspect, encode, decode as decodeGeneric } from './codec.mjs';

const one = {
  6: 'DELETE FILE',
  5: 'TERMINATE EF',
  4: 'ACTIVATE FILE, ACTIVATE RECORD(S)',
  3: 'DEACTIVATE FILE, DEACTIVATE RECORD(S)',
  2: 'WRITE BINARY, WRITE RECORD, APPEND RECORD',
  1: 'UPDATE BINARY, UPDATE RECORD, ERASE BINARY, ERASE RECORD(S)',
  0: 'READ BINARY/RECORD(S), SEARCH BINARY/RECORD, COMPARE BINARY/RECORD',
};

const more = [
  {
    5: 'TERMINATE EF',
    4: 'ACTIVATE FILE, ACTIVATE RECORD(S)',
    3: 'DEACTIVATE FILE, DEACTIVATE RECORD(S)',
    2: 'APPEND RECORD',
    1: 'UPDATE BINARY, UPDATE RECORD',
    0: 'READ BINARY/RECORD(S), SEARCH BINARY/RECORD',
  },
  {
    5: 'DELETE EF',
    4: 'RFU',
    3: 'RFU',
    2: 'WRITE BINARY, WRITE RECORD',
    1: 'ERASE BINARY, ERASE RECORD(S)',
    0: 'COMPARE BINARY/RECORD',
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
