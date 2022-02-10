import { debuglog as _debuglog } from 'util';
import CommandApdu from './command_apdu.mjs';

const debuglog = _debuglog('get_response');

export default getResponse;

async function getResponse(reader, { le, bl }) {
  const capdu = new CommandApdu(0x00, 0xc0, 0, 0, { le });
  debuglog(capdu.toDebugString());

  return reader.transmit(capdu, bl);
}
