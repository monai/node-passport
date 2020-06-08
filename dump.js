const Reader = require('./lib/reader');
const selectApplication = require('./lib/iso7816/selectApplication');
const { performBac } = require('./lib/doc9309/bac');
const { computeDbaks } = require('./lib/doc9309/dbak');
const { readFile } = require('./lib/readFile');
const SimpleReader = require('./lib/simpleReader');
const SecureReader = require('./lib/secureReader');
const { createInspector } = require('./lib/inspect');

const kmrz = process.env.KMRZ;
if ( ! kmrz) {
  throw 'Environment variable KMRZ is not defined';
}

work();
async function work() {
  const reader = new Reader();
  const simpleReader = new SimpleReader(reader);

  try {
    await reader.waitForCard();
    await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

    await selectApplication(simpleReader, 'A0000002471001');

    const session = await performBac(reader, computeDbaks(kmrz));
    const sreader = new SecureReader(reader, session);

    const res = await readFile({ reader: sreader, sfi: 0x01 });

    const inspect = createInspector({
      tag: {
        1: {
          0: 'EF.COM',
          1: 'EF.DG1',
          14: 'EF.DG14',
          21: 'EF.DG2',
          23: 'EF.SOD',
          28: 'Tag list',
          31: 'MRZ data object',
          46: 'Biometric data block',
          54: 'Unicode Version Level',
          96: 'Biometric information template',
          97: 'Biometric information group template',
        },
        2: {
        }
      }
    });

    inspect(res);
  } catch (ex) {
    console.error(ex);
  }
}


