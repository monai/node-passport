const util = require('util');
const CommandApdu = require('./CommandApdu');

const debuglog = util.debuglog('get_challenge');

module.exports = getChallenge;

async function getChallenge(reader, p1, { le, bl }) {
  const apdu = new CommandApdu(0x00, 0x84, p1, 0x00, { le });
  debuglog(apdu.toDebugString());

  return reader.transmit(apdu, bl);
}
