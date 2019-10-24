const { ResponseApdu } = require('./iso7816/apdu');
const { protect, unprotect } = require('./doc9309/secure');

class SecureReader {
  constructor(reader, session) {
    this.reader = reader;
    this.session = session;
  }

  async transmit(apdu) {
    const le = (apdu.le || 0) + 28;
    const protekted = protect(this.session, apdu);
    const res = await this.reader.transmit(protekted.toBuffer(), le);
    return unprotect(this.session, new ResponseApdu(res));
  }
}

module.exports = SecureReader;
