export default function log2(x) {
  let res = 0;
  while (x) {
    x /= 2n;
    res += 1;
  }
  return res;
}
