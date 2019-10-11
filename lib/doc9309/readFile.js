const { CommandAPDU, ResponseAPDU } = require('./apdu');
const { protect, unprotect, asn1Length } = require('./secure');

module.exports = {
  readFileSF,
  readFileSFI,
};

async function readFileSF(sreader, fileId) {
  let apdu, res, data;

  apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: fileId });
  res = await sreader.transmit(apdu, 16);

  let offset = 0;
  res = await readBinary(sreader, offset, 4);

  const [bodyLength, o] = asn1Length(res.data.slice(1));
  offset = o + 1;

  const header = res.data.slice(0, offset);

  const maxSize = 0xe0;
  let toRead = bodyLength;
  const bodyParts = [];
  while (toRead > 0) {
    res = await readBinary(sreader, offset, Math.min(toRead, maxSize));
    if (res.noError()) {
      toRead -= res.data.length;
      offset += res.data.length;
      bodyParts.push(res.data);
    } else {
      throw new Error(`bad response 0x${res.sw1}${res.sw2}`);
    }
  }
  const body = Buffer.concat(bodyParts);
  if (body.length !== bodyLength) {
    throw new Error(`invalid body length; expected length of ${bodyLength}, found ${body.length}`);
  }

  return Buffer.concat([header, body]);
}

async function readFileSFI(reader) {

}

function readBinary(sreader, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });

  return sreader.transmit(apdu, 0xff);
}
