const ResponseApdu = require('./iso7816/ResponseApdu');

class SimpleReader {
  constructor(reader) {
    this.reader = reader;
  }

  async transmit(apdu, bl = 0) {
    const le = (apdu.le || 0) + 2 + bl;
    const res = await this.reader.transmit(apdu.toBuffer(), le);
    return new ResponseApdu(res);
  }
}

module.exports = SimpleReader;
