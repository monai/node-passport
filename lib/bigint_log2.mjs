export default function log2(x) {
  let res = 0n;
  x = BigInt(x);
  while (x) {
    x /= 2n;
    res += 1n;
  }
  return res;
}
