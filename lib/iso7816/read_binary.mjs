import { debuglog as _debuglog } from 'util';
import CommandApdu from './command_apdu.mjs';

const debuglog = _debuglog('read_binary');

export default readBinary;

function readBinary(reader, offset, le) {
  const p1 = (offset >> 8) & 0xff;
  const p2 = offset & 0xff;
  const capdu = new CommandApdu(0x00, 0xb0, p1, p2, { le });

  debuglog(capdu.toDebugString());

  return reader.transmit(capdu);
}
