const util = require('util');
const SimpleReader = require('./simple_reader');
const { protectCommandApdu, unprotectResponseApdu } = require('./doc9309/sm');

const debuglog = util.debuglog('secure_reader');

class SecureReader extends SimpleReader {
  constructor(reader, session) {
    super(reader);

    this.session = session;
  }

  async transmit(capdu, bl = 0) {
    bl = (capdu.le || 0) + 28 + bl;

    debuglog(capdu.toDebugString());
    const pcapdu = protectCommandApdu(this.session, capdu);
    const prapdu = await super.transmit(pcapdu, bl);
    const rapdu = unprotectResponseApdu(this.session, prapdu);
    debuglog(rapdu.toDebugString());

    return rapdu;
  }
}

module.exports = SecureReader;
