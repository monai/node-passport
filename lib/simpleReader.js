const util = require('util');
const ResponseApdu = require('./iso7816/ResponseApdu');

const debuglog = util.debuglog('simple_reader');

class SimpleReader {
  constructor(reader) {
    this.reader = reader;
  }

  async transmit(capdu, bl = 0) {
    bl = (capdu.le || 0) + 2 + bl;

    debuglog(capdu.toDebugString());
    const result = await this.reader.transmit(capdu.toBuffer(), bl);
    const rapdu = new ResponseApdu(result);
    debuglog(rapdu.toDebugString());

    return rapdu;
  }
}

module.exports = SimpleReader;
