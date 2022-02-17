import { encode as encodeLength } from './ber/length.mjs';

export default tlv;

function tlv(tag, data) {
  const n = Math.ceil(Math.log2(tag + 1) / 8);
  const tagBuf = Buffer.alloc(n);
  tagBuf.writeUIntBE(tag, 0, n);

  return Buffer.concat([
    tagBuf,
    encodeLength(data?.length ?? 0),
    data,
  ].filter(Boolean));
}
