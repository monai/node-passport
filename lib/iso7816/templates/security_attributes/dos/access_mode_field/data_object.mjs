import { inspect, encode, decode as decodeGeneric } from './codec.mjs';

const one = {
  6: 'DELETE DATA',
  5: 'MANAGE DATA Terminate',
  4: 'MANAGE DATA Activate',
  3: 'MANAGE DATA Deactivate',
  2: 'MANAGE SECURITY ENVIRONMENT',
  1: 'PUT DATA/PUT NEXT DATA/UPDATE DATA',
  0: 'GET DATA/GET NEXT DATA/COMPARE DATA',
};

const more = [
  {
    5: 'MANAGE DATA Terminate',
    4: 'MANAGE DATA Activate',
    3: 'MANAGE DATA Deactivate',
    2: 'MANAGE SECURITY ENVIRONMENT',
    1: 'PUT DATA/UPDATE DATA',
    0: 'GET DATA/GET NEXT DATA',
  },
  {
    5: 'DELETE DATA',
    4: 'command creating data objects (see ISO/IEC 7816-9)',
    3: 'RFU',
    2: 'RFU',
    1: 'PUT NEXT DATA',
    0: 'COMPARE DATA',
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
