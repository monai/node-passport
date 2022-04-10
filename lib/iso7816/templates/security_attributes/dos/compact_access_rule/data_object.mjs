import { dataObject } from '../access_mode_field/type.mjs';
import { encode, decode as decodeGeneric, inspect as inspectGeneric } from './index.mjs';

export {
  encode,
};

export function decode(data) {
  return decodeGeneric(data, { type: dataObject });
}

export function inspect(data) {
  return inspectGeneric(data, { type: dataObject });
}
