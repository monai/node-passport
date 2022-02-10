import { debuglog as _debuglog } from 'util';
import CommandApdu from './command_apdu.mjs';

const debuglog = _debuglog('get_challenge');

export default getChallenge;

async function getChallenge(reader, p1, { le, bl }) {
  const capdu = new CommandApdu(0x00, 0x84, p1, 0x00, { le });
  debuglog(capdu.toDebugString());

  return reader.transmit(capdu, bl);
}
