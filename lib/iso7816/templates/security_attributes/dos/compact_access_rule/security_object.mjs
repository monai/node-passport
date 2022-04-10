import { securityObject } from '../access_mode_field/type.mjs';
import { encode, decode as decodeGeneric, inspect as inspectGeneric } from './index.mjs';

export {
  encode,
};

export function decode(data) {
  return decodeGeneric(data, { type: securityObject });
}

export function inspect(data) {
  return inspectGeneric(data, { type: securityObject });
}
