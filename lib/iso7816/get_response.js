const util = require('util');
const CommandApdu = require('./command_apdu');

const debuglog = util.debuglog('get_response');

module.exports = getResponse;

async function getResponse(reader, { le, bl }) {
  const capdu = new CommandApdu(0x00, 0xc0, 0, 0, { le });
  debuglog(capdu.toDebugString());

  return reader.transmit(capdu, bl);
}
