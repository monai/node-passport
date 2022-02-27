import parse from './parse.mjs';

export default function parseObject(data, options) {
  return parse(data, options).node.toObject();
}
