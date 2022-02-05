const util = require('util');
const CommandApdu = require('./command_apdu');

const debuglog = util.debuglog('read_record');

module.exports = readRecord;

function readRecord(reader, p1, p2, { le }) {
  const capdu = new CommandApdu(0x00, 0xb2, p1, p2, { le });

  debuglog(capdu.toDebugString());

  return reader.transmit(capdu);
}
