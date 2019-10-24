const { ResponseApdu } = require('./iso7816/apdu');

class SimpleReader {
  constructor(reader) {
    this.reader = reader;
  }

  async transmit(apdu, bufferLength) {
    // TODO: implement buffer size calculation
    const res = await this.reader.transmit(apdu.toBuffer(), bufferLength);
    return new ResponseApdu(res);
  }
}

module.exports = SimpleReader;
