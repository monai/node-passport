import parse from './parse.mjs';
import createObject from '../tree/crate_object.mjs';

export default function parseObject(data, options) {
  return createObject(parse(data, options).node);
}
