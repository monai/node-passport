const { ResponseApdu } = require('./iso7816/apdu');

class SimpleReader {
  constructor(reader) {
    this.reader = reader;
  }

  async transmit(apdu) {
    const le = (apdu.le || 0) + 2;
    const res = await this.reader.transmit(apdu.toBuffer(), le);
    return new ResponseApdu(res);
  }
}

module.exports = SimpleReader;
