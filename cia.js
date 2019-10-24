const Reader = require('./lib/reader');
const selectApplication = require('./lib/doc9309/selectApplication');
const { performBac } = require('./lib/doc9309/bac');
const { dbak } = require('./lib/doc9309/dbak');
const { createReadStream, readFile } = require('./lib/doc9309/readFile');
const SecureReader = require('./lib/secureReader');
const decodeFile = require('./lib/decodeFile');
const stream = require('stream-util2');

const { CommandApdu } = require('./lib/doc9309/apdu');

work();
async function work() {
  const reader = new Reader();

  try {
    await reader.waitForCard();
    await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

    let apdu, res;

    apdu = new CommandApdu(0x00, 0xa4, 0x04, 0x0c, { data: 'E828BD080F' });
    res = await reader.transmit(apdu.toBuffer(), 0xff);
    console.log(res);

    // apdu = new CommandApdu(0x00, 0xa4, 0x02, 0x0c, { data: '5032' });
    // res = await reader.transmit(apdu.toBuffer(), 16);
    // console.log(res);

    // apdu = new CommandApdu(0x00, 0xb0, 0x00, 0x00, { le: 39 });
    // res = await reader.transmit(apdu.toBuffer(), 0xff);
    // console.log(res);

    apdu = new CommandApdu(0x00, 0xb0, 0x80 ^ 0x12, 0x00, { le: 39 });
    res = await reader.transmit(apdu.toBuffer(), 0xff);
    console.log(res);

    // await selectApplication(reader);
    // const session = await performBac(reader, dbak(kmrz));
    // const sreader = new SecureReader(reader, session);
    //
    // const dg14 = await readFile({ sreader, sfi: 0x0f });
    // console.log(dg14);

  } catch (ex) {
    console.error(ex);
  }
}
