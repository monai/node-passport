const { CommandAPDU, ResponseAPDU } = require('./apdu');
const { decode: decodeLength } = require('../asn1/length');

module.exports = {
  readFileSelect,
  readFileSfi,
};

async function readFileSelect(sreader, fileId) {
  let apdu, res;
  const reader = readBinary(sreader);

  apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: fileId });
  res = await sreader.transmit(apdu, 16);

  let offset = 0;
  res = await reader(offset, 4);

  const [bodyLength, o] = decodeLength(res.data.slice(1));
  offset = o + 1;

  const header = res.data.slice(0, offset);
  body = await readBinaryContinous(reader, offset, bodyLength);

  return Buffer.concat([header, body]);
}

async function readFileSfi(sreader, sfi) {
  let apdu, res;
  const reader = readBinarySfi(sreader, sfi);
  const reader2 = readBinary(sreader, sfi);

  let offset = 0;
  res = await reader(offset, 0x4);

  const [bodyLength, o] = decodeLength(res.data.slice(1));
  offset = o + 1;

  const header = res.data.slice(0, offset);
  body = await readBinaryContinous(reader2, offset, bodyLength);

  return Buffer.concat([header, body]);
}

function readBinary(sreader) {
  return (offset, le) => {
    const p1 = offset >>> 8;
    const p2 = offset & 0xff;
    const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });

    return sreader.transmit(apdu, 0xff);
  }
}

function readBinarySfi(sreader, sfi) {
  return (offset, le) => {
    // 7618-4 7.2.2
    const apdu = new CommandAPDU(0x00, 0xb0, 0x80 ^ sfi, offset, { le });
    return sreader.transmit(apdu, 0xff);
  };
}

async function readBinaryContinous(reader, offset, le) {
  // FIXME: fails with greated length
  const maxSize = 0x77;
  const acc = [];
  let res;

  while (le > 0) {
    res = await reader(offset, Math.min(le, maxSize));
    const length = res.data.length;

    if (res.noError()) {
      le -= length;
      offset += length;
      acc.push(res.data);
    } else {
      throw new Error(`bad response 0x${res.sw1.toString('hex')}${res.sw2.toString('hex')}`);
    }
  }

  return Buffer.concat(acc);
}
