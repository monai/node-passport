import { dataObject } from '../access_mode_field/type.mjs';
import { inspect, encode, decode as decodeGeneric } from './index.mjs';

export {
  inspect,
  encode,
};

export function decode(data) {
  return decodeGeneric(data, { type: dataObject });
}
