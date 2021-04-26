const util = require('util');
const CommandApdu = require('./command_apdu');

const debuglog = util.debuglog('get_challenge');

module.exports = getChallenge;

async function getChallenge(reader, p1, { le, bl }) {
  const capdu = new CommandApdu(0x00, 0x84, p1, 0x00, { le });
  debuglog(capdu.toDebugString());

  return reader.transmit(capdu, bl);
}
