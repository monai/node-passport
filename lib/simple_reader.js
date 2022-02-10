import { debuglog as _debuglog } from 'util';
import ResponseApdu from './iso7816/response_apdu.js';

const debuglog = _debuglog('simple_reader');

class SimpleReader {
  constructor(reader) {
    this.reader = reader;
  }

  async transmit(capdu, bl = 0) {
    bl = (capdu.le || 0) + 2 + bl;

    debuglog(capdu.toDebugString());
    const res = await this.reader.transmit(capdu.toBuffer(), bl);

    if (res.length < 2) {
      throw new RangeError(`The length of response is out of range. It must be >= 2. Received ${res.length}`);
    }

    const rapdu = new ResponseApdu(res);
    debuglog(rapdu.toDebugString());

    return rapdu;
  }
}

export default SimpleReader;
