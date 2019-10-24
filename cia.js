const Reader = require('./lib/reader');
const selectApplication = require('./lib/iso7816/selectApplication');
const { readFile } = require('./lib/readFile');
const SimpleReader = require('./lib/simpleReader');
const stream = require('stream-util2');

const { CommandApdu } = require('./lib/iso7816/apdu');

work();
async function work() {
  const reader = new Reader();
  const sreader = new SimpleReader(reader);

  try {
    await reader.waitForCard();
    await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

    await selectApplication(sreader, 'E828BD080F');

    const res = await readFile({ reader: sreader, sfi: 0x12 });
    console.log(res);
  } catch (ex) {
    console.error(ex);
  }
}
