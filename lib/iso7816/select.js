const util = require('util');
const CommandApdu = require('./CommandApdu');

const debuglog = util.debuglog('select');

module.exports = select;

async function select(reader, p1, p2, { data, le, bl }) {
  const capdu = new CommandApdu(0x00, 0xa4, p1, p2, { data, le });
  debuglog(capdu.toDebugString());

  return reader.transmit(capdu, bl);
}
