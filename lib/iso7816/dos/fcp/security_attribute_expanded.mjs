// BS ISO/IEC 7816-4:2013
// 9.3.4 Access rule references

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  let out = {};

  if (data.length === 1) {
    [out.arr] = data;
  } else if (data.length === 3) {
    out.fileIdentifier = data.slice(0, 2);
    [out.arr] = data.slice(2);
  } else if (data.length > 4 && data.length % 2 === 0) {
    out.fileIdentifier = data.slice(0, 2);
    data = data.slice(2);

    out.entries = [];
    for (let i = 0; i < data.length / 2; i += 2) {
      out.entries.push({
        seid: data[i],
        arr: data[i + 1],
      });
    }
  } else {
    out = undefined;
  }

  return out;
}

export function inspect(data) {
  const out = decode(data);

  if (out.fileIdentifier) {
    out.fileIdentifier = out.fileIdentifier.toString('hex');
  }

  return out;
}
