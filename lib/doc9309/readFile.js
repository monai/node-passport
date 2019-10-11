const { CommandAPDU, ResponseAPDU } = require('./apdu');
const { protect, unprotect, asn1Length } = require('./secure');

module.exports = {
  readFileSF,
  readFileSFI,
};

async function readFileSF(reader, session, fileId) {
  let apdu, res, data, protected, unprotected;

  apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: fileId });
  protected = protect(session, apdu);
  res = await reader.transmit(protected.toBuffer(), 16);
  unprotected = unprotect(session, new ResponseAPDU(res));

  let offset = 0;
  res = await readBinary(reader, session, offset, 4);
  unprotected = unprotect(session, new ResponseAPDU(res));

  const [bodyLength, o] = asn1Length(unprotected.data.slice(1));
  offset = o + 1;

  const header = unprotected.data.slice(0, offset);

  const maxSize = 0xe0;
  let toRead = bodyLength;
  const bodyParts = [];
  while (toRead > 0) {
    res = await readBinary(reader, session, offset, Math.min(toRead, maxSize));
    unprotected = unprotect(session, new ResponseAPDU(res));
    if (unprotected.noError()) {
      toRead -= unprotected.data.length;
      offset += unprotected.data.length;
      bodyParts.push(unprotected.data);
    } else {
      throw new Error(`bad response 0x${unprotected.sw1}${unprotected.sw2}`);
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

function readBinary(reader, session, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });
  const protected = protect(session, apdu);

  return reader.transmit(protected.toBuffer(), 0xff);
}
