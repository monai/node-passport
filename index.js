const fs = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');

const Reader = require('./lib/reader');
const { authentication, computeSessionKeys } = require('./lib/doc9309/bac');
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
  const options = {
    bac: {
      keys: dbak(kmrz),
    },
  };

  try {
    await reader.waitForCard();
    await reader.connect();

    let apdu, res, data, protected, unprotected;

    apdu = new CommandAPDU(0x00, 0xa4, 0x04, 0x0c, { data: 'A0000002471001' });
    res = await reader.transmit(apdu.toBuffer(), 2);
    options.selectApplication = res;

    apdu = new CommandAPDU(0x00, 0x84, 0x00, 0x00, { le: 0x08 });
    res = await reader.transmit(apdu.toBuffer(), 10);
    options.bac.rndIc = res.slice(0, 8);
    Object.assign(options.bac, await authenticate(options.bac));

    data = Buffer.concat(options.bac.keysIfd);
    apdu = new CommandAPDU(0x00, 0x82, 0x00, 0x00, { data, le: 0x28 });
    res = await reader.transmit(apdu.toBuffer(), 42);
    options.bac.keysIc = res;

    const [ksEnc, ksMac, ssc] = computeSessionKeys(options);
    options.bac.session = {
      ksEnc,
      ksMac,
      ssc,
    };

    apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: '011e' });
    protected = protect(options.bac.session, apdu);
    res = await reader.transmit(protected.toBuffer(), 16);
    unprotected = unprotect(options.bac.session, new ResponseAPDU(res));

    let offset = 0;
    res = await readBinary(reader, options.bac.session, offset, 4);
    console.log(res);
    unprotected = unprotect(options.bac.session, new ResponseAPDU(res));

    const [bodySize, o] = asn1Length(unprotected.data.slice(1));
    offset = o + 1;

    const header = unprotected.data.slice(0, offset);
    console.log(bodySize, offset, header);
  } catch (ex) {
    console.error(ex);
  }
}

function readBinary(reader, session, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });
  const protected = protect(session, apdu);

  return reader.transmit(protected.toBuffer(), 40);
}

async function authenticate(bac) {
  const { keys, rndIc } = bac;
  const randomBytes = promisify(crypto.randomBytes);
  const rnd = await randomBytes(24);

  const rndIfd = rnd.slice(0, 8);
  const kIfd = rnd.slice(8, 24);

  const keysIfd = authentication(keys, rndIc, rndIfd, kIfd);
  return {
    rndIfd,
    kIfd,
    keysIfd,
  };
}
