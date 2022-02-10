import { debuglog as _debuglog } from 'util';
import CommandApdu from './command_apdu.mjs';

const debuglog = _debuglog('select');

export default select;

async function select(reader, p1, p2, { data, le, bl }) {
  const capdu = new CommandApdu(0x00, 0xa4, p1, p2, { data, le });
  debuglog(capdu.toDebugString());

  return reader.transmit(capdu, bl);
}
