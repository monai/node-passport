const Reader = require('./lib/reader');
const selectApplication = require('./lib/doc9309/selectApplication');
const { performBac } = require('./lib/doc9309/bac');
const { dbak } = require('./lib/doc9309/dbak');
const { CommandAPDU, ResponseAPDU } = require('./lib/doc9309/apdu');
const { protect, unprotect, asn1Length } = require('./lib/doc9309/secure');

const kmrz = process.env.KMRZ;
if ( ! kmrz) {
  throw 'Environment variable KMRZ is not defined';
}

work();
async function work() {
  const reader = new Reader();

  try {
    await reader.waitForCard();
    await reader.connect();

    await selectApplication(reader);
    const session = await performBac(reader, dbak(kmrz));

    let apdu, res, data, protected, unprotected;

    apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: '011e' });
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
      }
    }
    const body = Buffer.concat(bodyParts);
    if (body.length !== bodyLength) {
      throw new Error(`invalid body length; expected length of ${bodyLength}, found ${body.length}`);
    }
    console.log(body);
  } catch (ex) {
    console.error(ex);
  }
}

function readBinary(reader, session, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });
  const protected = protect(session, apdu);

  return reader.transmit(protected.toBuffer(), 0xff);
}
