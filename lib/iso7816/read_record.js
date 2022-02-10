import { debuglog as _debuglog } from 'util';
import CommandApdu from './command_apdu.js';

const debuglog = _debuglog('read_record');

export default readRecord;

function readRecord(reader, p1, p2, { le }) {
  const capdu = new CommandApdu(0x00, 0xb2, p1, p2, { le });

  debuglog(capdu.toDebugString());

  return reader.transmit(capdu);
}
