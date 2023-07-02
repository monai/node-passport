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

  const liteid2021PaceCan = Buffer.from(process.env.LITEID_2021_PACE_CAN);

  const liteid2021PacePin = Buffer.from(process.env.LITEID_2021_PACE_PIN);
  const liteid2021PacePinNew = Buffer.from(process.env.LITEID_2021_PACE_PIN_NEW);

  const liteid2021PinQes = Buffer.from(process.env.LITEID_2021_PIN_QES);
  const liteid2021PinQesNew = Buffer.from(process.env.LITEID_2021_PIN_QES_NEW);

  console.log('= Perform PACE with CAN');
  const sessionCan = await performPace(simpleReader, {
    password: liteid2021PaceCan,
    passwordType: 'id-CAN',
    reference: 'id-CAN',
    protocol: 'id-PACE-ECDH-GM-AES-CBC-CMAC-128',
    standardizedDomainParametersId: 12,
    generalAuthenticateLe: 0x80,
  });
  const secureReaderCan = new SecureReader(reader, sessionCan);

  console.log('= Perform PACE with PIN over CAN');
  const sessionPin = await performPace(secureReaderCan, {
    password: liteid2021PacePin,
    passwordType: 'id-PIN',
    reference: 'id-PIN',
    protocol: 'id-PACE-ECDH-GM-AES-CBC-CMAC-128',
    standardizedDomainParametersId: 12,
    generalAuthenticateLe: 0x80,
  });
  const secureReaderPin = new SecureReader(reader, sessionPin);

  apdu = new CommandApdu(0x00, 0x24, 0x01, 0x07, { data: liteid2021PacePinNew });
  console.log('= PACE-PIN: CHANGE REFERENCE DATA', apdu.toDebugString());
  res = await secureReaderPin.transmit(apdu);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res);
  }

  apdu = new CommandApdu(0x00, 0xa4, 0x08, 0x00, { data: 'df02' });
  console.log('= Select app SSCD: DF02:', apdu.toDebugString());
  res = await secureReaderPin.transmit(apdu);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res);
  }

  apdu = new CommandApdu(0x00, 0x24, 0x00, 0x81, {
    data: Buffer.concat([liteid2021PinQes, liteid2021PinQesNew]),
  });
  console.log('= PIN.QES: CHANGE REFERENCE DATA', apdu.toDebugString());
  res = await secureReaderPin.transmit(apdu);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res);
  }
}
