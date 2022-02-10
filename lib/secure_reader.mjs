import { debuglog as _debuglog } from 'util';
import SimpleReader from './simple_reader.mjs';
import { protectCommandApdu, unprotectResponseApdu } from './doc9309/sm.mjs';

const debuglog = _debuglog('secure_reader');

class SecureReader extends SimpleReader {
  constructor(reader, session) {
    super(reader);

    this.session = session;
  }

  async transmit(capdu, bl = 0) {
    bl = (capdu.le || 0) + 28 + bl;

    debuglog(capdu.toDebugString());
    const pcapdu = protectCommandApdu(this.session, capdu);
    const prapdu = await super.transmit(pcapdu, bl);
    const rapdu = unprotectResponseApdu(this.session, prapdu);
    debuglog(rapdu.toDebugString());

    return rapdu;
  }
}

export default SecureReader;
