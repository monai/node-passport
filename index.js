const Reader = require('./lib/reader');
const selectApplication = require('./lib/doc9309/selectApplication');
const { performBac } = require('./lib/doc9309/bac');
const { dbak } = require('./lib/doc9309/dbak');
const { createReadStream, readFile } = require('./lib/doc9309/readFile');
const SecureReader = require('./lib/secureReader');
const decodeFile = require('./lib/decodeFile');
const stream = require('stream-util2');

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

    // const fileSelect = await readFileSelect(sreader, '011e');
    // console.log(fileSelect);

    // const fileSfi = await readFileSfi(sreader, 0x1e);
    // decodeFile(fileSfi);

    // const dg01 = await readFileSfi(sreader, 0x01);
    // console.log(dg01);
    // console.log(dg01.toString());

    // const dg02 = await readFileSfi(sreader, 0x02);
    // console.log(dg02);

    const dg15 = await readFile({ sreader, sfi: 0xff });

    console.log('ok', dg15);

  } catch (ex) {
    console.error(ex);
  }
}
