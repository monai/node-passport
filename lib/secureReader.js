const util = require('util');
const SimpleReader = require('./simpleReader');
const { protect, unprotect } = require('./doc9309/secure');

const debuglog = util.debuglog('secure_reader');

class SecureReader extends SimpleReader {
  constructor(reader, session) {
    super(reader);

    this.session = session;
  }

  async transmit(apdu) {
    const bl = (apdu.le || 0) + 28;

    debuglog(apdu.toBuffer());
    const papdu = protect(this.session, apdu);
    const prapdu = await super.transmit(papdu, bl);
    const rapdu = unprotect(this.session, prapdu);
    debuglog(rapdu.toBuffer());

    return rapdu;
  }
}

module.exports = SecureReader;
