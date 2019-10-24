const Reader = require('./lib/reader');
const selectApplication = require('./lib/doc9309/selectApplication');
const { performBac } = require('./lib/doc9309/bac');
const { dbak } = require('./lib/doc9309/dbak');
const { readFile } = require('./lib/doc9309/readFile');
const SecureReader = require('./lib/secureReader');

const { CommandAPDU } = require('./lib/doc9309/apdu');

const kmrz = process.env.KMRZ;
if ( ! kmrz) {
  throw 'Environment variable KMRZ is not defined';
}

work();
async function work() {
  const reader = new Reader();

  try {
    await reader.waitForCard();
    await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

    await selectApplication(reader);
    const session = await performBac(reader, dbak(kmrz));
    const sreader = new SecureReader(reader, session);

    const dg14 = await readFile({ sreader, sfi: 0x0e });
    console.log(dg14);

  } catch (ex) {
    console.error(ex);
  }
}
