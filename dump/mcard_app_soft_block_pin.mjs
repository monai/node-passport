/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import SimpleReader from '../lib/simple_reader.mjs';
import select from '../lib/iso7816/select.mjs';
import performPace from '../lib/doc9309/perform_pace.mjs';
import { main, printError } from './util.mjs';

dotenv.config();

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  console.log('= Select MF: 3F00');
  const res = await select(simpleReader, 0x00, 0x00, { data: '3F00', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  }

  const liteid2021PacePinIncorrect = Buffer.from(process.env.LITEID_2021_PACE_PIN_INCORRECT);

  const result = [];
  for (let i = 0; i < 3; i += 1) {
    console.time('testPin');
    const test = await testPin(simpleReader, liteid2021PacePinIncorrect);
    result.push(test);
    console.log(`PACE with PIN attemp: ${i}, counter: ${test}`);
    console.timeEnd('testPin');
  }

  if (result[2] === 1) {
    console.log('PACE-PIN is soft blocked.');
  }
}

async function testPin(reader, pin) {
  try {
    await performPace(reader, {
      password: pin,
      passwordType: 'id-PIN',
      reference: 'id-PIN',
      protocol: 'id-PACE-ECDH-GM-AES-CBC-CMAC-128',
      standardizedDomainParametersId: 12,
      generalAuthenticateLe: 0x80,
    });

    return true;
  } catch (err) {
    // console.log(err);
    if (err.sw1[0] === 0x63 && err.sw2[0] & 0xc0) {
      return err.sw2[0] & 0x0f;
    }

    throw err;
  }
}
