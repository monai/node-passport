const { ResponseAPDU } = require('./doc9309/apdu');
const { protect, unprotect } = require('./doc9309/secure');

class SecureReader {
  constructor(reader, session) {
    this.reader = reader;
    this.session = session;
  }

  async transmit(apdu, bufferLength) {
    const protekted = protect(this.session, apdu);
    // TODO: implement buffer size calculation
    const res = await this.reader.transmit(protekted.toBuffer(), bufferLength);
    return unprotect(this.session, new ResponseAPDU(res));
  }
}

module.exports = SecureReader;
