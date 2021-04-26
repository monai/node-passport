const util = require('util');
const CommandApdu = require('./command_apdu');

const debuglog = util.debuglog('read_binary');

module.exports = readBinary;

function readBinary(reader, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const capdu = new CommandApdu(0x00, 0xb0, p1, p2, { le });

  debuglog(capdu.toDebugString());

  return reader.transmit(capdu);
}
