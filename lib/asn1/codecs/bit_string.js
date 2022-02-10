export function encode() {

}

export function decode(data) {
  const bits = [];
  const unused = data[0];

  for (let byte of data.slice(1)) {
    let l = 8;
    const bbits = [];
    // eslint-disable-next-line no-plusplus
    while (l--) {
      bbits.push(byte & 0x01);
      byte >>= 1;
    }
    Array.prototype.push.apply(bits, bbits.reverse());
  }

  return unused ? bits.slice(0, -unused) : bits;
}

export function inspect(data) {
  return decode(data).join('');
}
