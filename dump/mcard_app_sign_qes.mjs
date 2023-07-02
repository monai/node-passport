/* eslint-disable no-console */
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import SimpleReader from '../lib/simple_reader.mjs';
import SecureReader from '../lib/secure_reader.mjs';
import select from '../lib/iso7816/select.mjs';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
import performPace from '../lib/doc9309/perform_pace.mjs';
import { main, printError } from './util.mjs';
import printBer from '../lib/asn1/util/print_ber.mjs';
import fciTemplate from '../lib/iso7816/templates/file_control_information/fci.mjs';
import tlv from '../lib/asn1/tlv.mjs';
import hex from '../lib/util/hex.mjs';

dotenv.config();

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);
  let res;

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  console.log('= Select MF: 3F00');
  res = await select(simpleReader, 0x00, 0x00, { data: '3F00', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  const liteid2021PacePin = Buffer.from(process.env.LITEID_2021_PACE_PIN);

  const liteid2021PinQes = Buffer.from(process.env.LITEID_2021_PIN_QES);

  console.log('= Perform PACE with PIN');
  const session = await performPace(simpleReader, {
    password: liteid2021PacePin,
    passwordType: 'id-PIN',
    reference: 'id-PIN',
    protocol: 'id-PACE-ECDH-GM-AES-CBC-CMAC-128',
    standardizedDomainParametersId: 12,
    generalAuthenticateLe: 0x80,
  });
  const secureReader = new SecureReader(reader, session);

  console.log('= Select app SSCD: DF02');
  res = await select(secureReader, 0x08, 0x00, { data: 'df02', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  let data;
  let apdu;

  data = tlv(0x84, hex`88`);
  apdu = new CommandApdu(0x00, 0x22, 0x41, 0xb6, { data });
  console.log('= MSE:SET', apdu.toDebugString());
  res = await secureReader.transmit(apdu);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res);
  }

  apdu = new CommandApdu(0x00, 0x20, 0x00, 0x81, { data: liteid2021PinQes });
  console.log('= VERIFY', apdu.toDebugString());
  res = await secureReader.transmit(apdu);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res);
  }

  data = 'alio';
  data = createHash('sha384').update(data).digest();

  apdu = new CommandApdu(0x00, 0x2a, 0x9e, 0x9a, { data, le: 0x100 });
  console.log('= PSO: Digital signature', apdu.toDebugString());
  res = await secureReader.transmit(apdu);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res.data.length, res);
  }
}
