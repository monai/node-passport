import tlv from '../asn1/tlv.mjs';

export const buildDo8e = createFn(0x8e);
export const buildDo97 = createFn(0x97);

export function buildDo87(padding, data) {
  return tlv(0x87, Buffer.concat([
    Buffer.from([padding]),
    data,
  ]));
}

function createFn(tag) {
  return (data) => tlv(tag, data);
}
