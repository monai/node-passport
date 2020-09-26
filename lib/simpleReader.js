const util = require('util');
const ResponseApdu = require('./iso7816/ResponseApdu');

const debuglog = util.debuglog('simple_reader');

class SimpleReader {
  constructor(reader) {
    this.reader = reader;
  }

  async transmit(apdu, bl = 0) {
    const le = (apdu.le || 0) + 2 + bl;

    debuglog(apdu.toBuffer());
    const res = await this.reader.transmit(apdu.toBuffer(), le);
    const rapdu = new ResponseApdu(res);
    debuglog(rapdu.toBuffer());

    return rapdu;
  }
}

module.exports = SimpleReader;
