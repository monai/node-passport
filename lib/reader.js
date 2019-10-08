const { promisify } = require('util');
const pcsc = require('pcsclite');

class Reader {
  constructor() {
    const pl = pcsc();

    this.pl = pl;
    this.reader = null;
    this.state = null;
    this.atr = null;
    this.protocol = null;

    pl.on('reader', this.onReader.bind(this));
  }

  onReader(reader) {
    this.reader = reader;
    this.readerConnect = reader.connect.bind(reader);
    this.readerConnectP = promisify(this.readerConnect);
    this.readerTransmit = reader.transmit.bind(reader);
    this.readerTransmitP = promisify(this.readerTransmit);

    reader.on('error', this.onReaderError.bind(this));
    reader.on('status', this.onReaderStatus.bind(this));
  }

  onReaderError(err) {
    console.log('onReaderError', err);
  }

  onReaderStatus(status) {
    this.state = status.state;
    this.atr = status.atr;
  }

  isCardPresent() {
    if (this.state === null || ! this.reader) {
      return false;
    } else {
      return !!(this.state & this.reader.SCARD_STATE_PRESENT);
    }
  }

  waitForCard(timeout = 2000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();

      if (this.isCardPresent()) {
        resolve();
      } else {
        const handler = () => {
          if (this.isCardPresent()) {
            resolve();
          } else {
            if (Date.now() - start < timeout) {
              setTimeout(handler, 100);
            } else {
              reject(new Error('wait for card timeout'));
            }
          }
        };
        handler();
      }
    });
  }

  async connect(options) {
    if (this.protocol !== null) {
      return this.protocol;
    } else {
      const protocol = await this.readerConnectP(options);
      this.protocol = protocol;
      return protocol;
    }
  }

  transmit(message, le) {
    if ( ! this.protocol) {
      throw new Error('not connected');
    }
    return this.readerTransmitP(message, le, this.protocol);
  }
}

module.exports = Reader;
