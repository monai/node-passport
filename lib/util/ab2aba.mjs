export default function ab2aba(buf) {
  return Buffer.concat([buf, buf.slice(0, (buf.length / 2) | 0)]);
}
