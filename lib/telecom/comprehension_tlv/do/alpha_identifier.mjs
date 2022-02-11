// ETSI TS 102 223 V15.3.0 (2019-07)

// 8.2 Alpha identifier DO'05
export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const byte0 = data[0];

  if (byte0 === 0x80) {
    return trimEnd(data.slice(1));
  }

  if (byte0 === 0x81) {
    data = data.slice(1);
    const [length, base] = data;
    const basePointer = base << 6;
    data = data.slice(2, 2 + length);

    const chars = [];
    for (const char of data) {
      const codePoint = (char & 0x80) ? basePointer + char : char;
      chars.push(String.fromCodePoint(codePoint));
    }

    return chars.join('');
  }

  if (byte0 === 0x82) {
    throw new Error('Not implemented');
  }

  return data.toString();
}

function trimEnd(data) {
  if (data[data.length - 1] !== 0xff) {
    return data;
  }

  let l = data.length;
  // eslint-disable-next-line no-plusplus
  while (l--) {
    if (data[l] !== 0xff) {
      return data.slice(0, l);
    }
  }

  return data;
}
