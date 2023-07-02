/* eslint-disable no-console */
import dotenv from 'dotenv';
import SimpleReader from '../lib/simple_reader.mjs';
import SecureReader from '../lib/secure_reader.mjs';
import select from '../lib/iso7816/select.mjs';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
import performPace from '../lib/doc9309/perform_pace.mjs';
import { main, printError } from './util.mjs';
import printBer from '../lib/asn1/util/print_ber.mjs';
import fciTemplate from '../lib/iso7816/templates/file_control_information/fci.mjs';

dotenv.config();

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);
  let res;
  let apdu;

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  console.log('= Select MF: 3F00');
  res = await select(simpleReader, 0x00, 0x00, { data: '3F00', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  const liteid2021PacePuk = Buffer.from(process.env.LITEID_2021_PACE_PUK);
  const liteid2021PacePukNew = Buffer.from(process.env.LITEID_2021_PACE_PUK_NEW);

  console.log('= Perform PACE with PUK');
  const sessionPuk = await performPace(simpleReader, {
    password: liteid2021PacePuk,
    passwordType: 'id-PUK',
    reference: 'id-PUK',
    protocol: 'id-PACE-ECDH-GM-AES-CBC-CMAC-128',
    standardizedDomainParametersId: 12,
    generalAuthenticateLe: 0x80,
  });
  const secureReaderPuk = new SecureReader(reader, sessionPuk);

  // eslint-disable-next-line prefer-const
  apdu = new CommandApdu(0x00, 0x24, 0x01, 0x08, { data: liteid2021PacePukNew });
  console.log('= PACE-PUK: CHANGE REFERENCE DATA', apdu.toDebugString());
  res = await secureReaderPuk.transmit(apdu);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res);
  }
}
