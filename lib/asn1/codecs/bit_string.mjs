import bitReverse from '../../bit_reverse.mjs';
import Bitset from '../../bitset.mjs';

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const unused = data[0];
  const length = (data.length - 1) * 8 - unused;

  const out = data.slice(1).reduceRight((acc, byte) => {
    acc.push(bitReverse(byte));
    return acc;
  }, []);

  return Bitset.from(Buffer.from(out), length);
}

export function inspect(data) {
  return decode(data);
}
