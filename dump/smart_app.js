/* eslint-disable no-console */
const Reader = require('../lib/reader');
const SimpleReader = require('../lib/simple_reader');
const { selectApplication, dumpFile } = require('./util');

main();
async function main() {
  const reader = new Reader();
  reader.once('state', (state) => {
    if (state === 'present') {
      work(reader)
        .catch((error) => console.error('main error', error))
        .finally(() => {
          reader.close();
        });
    }
  });
}

async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')} ${reader.atr.toString()}`);

  const simpleReader = new SimpleReader(reader);

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  console.log('= Read EF.DIR');
  await dumpFile(simpleReader, '2f00');

  await selectApplication(simpleReader, 'd61659903701524f4f5400', 'ROOT');
  await dumpFile(simpleReader, '0101', false);

  await selectApplication(simpleReader, 'e828bd080fd616599037015349474e31', 'CIA_SIGN1');
  await dumpFile(simpleReader, '5032', { label: 'EF.CIAInfo' });
  await dumpFile(simpleReader, '5031', { label: 'EF.OD' });
  await dumpFile(simpleReader, '0103');
  await dumpFile(simpleReader, '0104');
  await dumpFile(simpleReader, '0102');
  await dumpFile(simpleReader, '5200', { label: 'EF.AOD' });

  await selectApplication(simpleReader, 'd616599037015349474e3100', 'SIGN1');
  await dumpFile(simpleReader, '0103');
  await dumpFile(simpleReader, '0104');
  await dumpFile(simpleReader, '0102');

  await selectApplication(simpleReader, 'e828bd080fd616599037014352595054', 'CIA_CRYPTO1');
  await dumpFile(simpleReader, '5032', { label: 'EF.CIAInfo' });
  await dumpFile(simpleReader, '5031', { label: 'EF.OD' });
  await dumpFile(simpleReader, '5200', { label: 'EF.AOD' });

  await selectApplication(simpleReader, 'd6165990370143525950544f3100', 'CRYPTO1');
  await dumpFile(simpleReader, '5300');
  await dumpFile(simpleReader, '5400');
  await dumpFile(simpleReader, '5600');
  await dumpFile(simpleReader, '5700');
  await dumpFile(simpleReader, '5701');
  await dumpFile(simpleReader, '5702');
  await dumpFile(simpleReader, '5703');
}
