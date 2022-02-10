import tlv from '../asn1/tlv.mjs';
import { encode as encodeLength } from '../asn1/ber/length.mjs';

export const buildDo8e = createFn(0x8e);
export const buildDo97 = createFn(0x97);

export function buildDo87(padding, data) {
  return Buffer.concat([
    Buffer.from([0x87]),
    encodeLength(data.length + 1),
    Buffer.from([padding]),
    data,
  ]);
}

function createFn(tag) {
  return (data) => tlv(tag, data);
}
