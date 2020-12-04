const util = require('util');
const ResponseApdu = require('./iso7816/ResponseApdu');

const debuglog = util.debuglog('simple_reader');

class SimpleReader {
  constructor(reader) {
    this.reader = reader;
  }

  async transmit(apdu, bl = 0) {
    bl = (apdu.le || 0) + 2 + bl;

    debuglog(apdu.toDebugString());
    const res = await this.reader.transmit(apdu.toBuffer(), bl);
    const rapdu = new ResponseApdu(res);
    debuglog(rapdu.toDebugString());

    return rapdu;
  }
}

module.exports = SimpleReader;
