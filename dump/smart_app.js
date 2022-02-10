/* eslint-disable no-console */
import dotenv from 'dotenv';
import SimpleReader from '../lib/simple_reader.js';
import SecureReader from '../lib/secure_reader.js';
import { oids, performPace } from '../lib/doc9309/perform_pace.js';
import {
  main, selectApplication, dumpFile, mseRestore, verify,
} from './util.js';

dotenv.config();

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')} ${reader.atr.toString()}`);

  const simpleReader = new SimpleReader(reader);

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  console.log('= Read EF.DIR');
  await dumpFile(simpleReader, '2f00');

  await selectApplication(simpleReader, 'd61659903701524f4f5400', 'ROOT');
  const can = await dumpFile(simpleReader, '0101', { parse: false });

  await selectApplication(simpleReader, 'e828bd080fd616599037015349474e31', 'CIA_SIGN1');
  await dumpFile(simpleReader, '5032', { label: 'EF.CIAInfo' });
  await dumpFile(simpleReader, '5031', { label: 'EF.OD' });
  await dumpFile(simpleReader, '5200', { label: 'EF.AOD' });

  await selectApplication(simpleReader, 'd616599037015349474e3100', 'SIGN1');

  console.log('= Perform PACE');
  const session = await performPace(simpleReader, {
    can,
    protocol: oids['id-PACE-ECDH-GM-3DES-CBC-CBC'],
    parameterId: 12,
  });
  const secureReader = new SecureReader(reader, session);

  await mseRestore(secureReader, 0x01);
  await verify(secureReader, Buffer.from(process.env.PIN));

  await dumpFile(secureReader, '0103', { parse: false, label: 'EF.PrKD' });
  await dumpFile(secureReader, '0104', { parse: false, label: 'EF.PuKD' });
  await dumpFile(secureReader, '0102', { parse: false, label: 'EF.CD' });

  await selectApplication(simpleReader, 'e828bd080fd616599037014352595054', 'CIA_CRYPTO1');
  await dumpFile(simpleReader, '5032', { label: 'EF.CIAInfo' });
  await dumpFile(simpleReader, '5031', { label: 'EF.OD' });
  await dumpFile(simpleReader, '5200', { label: 'EF.AOD' });

  await selectApplication(simpleReader, 'd6165990370143525950544f3100', 'CRYPTO1');
  await dumpFile(simpleReader, '5300', { label: 'EF.PrKD' });
  await dumpFile(simpleReader, '5400', { label: 'EF.PuKD' });
  await dumpFile(simpleReader, '5600', { label: 'EF.CD' });
  await dumpFile(simpleReader, '5700', { label: 'EF.DCOD' });
  await dumpFile(simpleReader, '5701'); // opaqueDOs
  await dumpFile(simpleReader, '5702'); // unknown; possibly 5701 extension
  await dumpFile(simpleReader, '5703'); // cache
}
