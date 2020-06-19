const util = require('util');
const CommandApdu = require('./CommandApdu');

const debuglog = util.debuglog('read_binary');

module.exports = readBinary;

function readBinary(reader, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandApdu(0x00, 0xb0, p1, p2, { le });

  debuglog(apdu.toBuffer());

  return reader.transmit(apdu);
}
