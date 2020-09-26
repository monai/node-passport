const util = require('util');
const ResponseApdu = require('./iso7816/ResponseApdu');
const { protect, unprotect } = require('./doc9309/secure');

const debuglog = util.debuglog('secure_reader');

class SecureReader {
  constructor(reader, session) {
    this.reader = reader;
    this.session = session;
  }

  async transmit(apdu) {
    const le = (apdu.le || 0) + 28;
    const protekted = protect(this.session, apdu);

    debuglog(protekted.toBuffer());
    const res = await this.reader.transmit(protekted.toBuffer(), le);
    const rapdu = new ResponseApdu(res);
    debuglog(rapdu.toBuffer());

    return unprotect(this.session, new ResponseApdu(res));
  }
}

module.exports = SecureReader;
