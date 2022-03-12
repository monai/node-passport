import EventEmitter from 'events';
import { debuglog as _debuglog, promisify } from 'util';
import pcsc from '@pokusew/pcsclite';

export default class Reader extends EventEmitter {
  constructor() {
    super();

    const pl = pcsc();

    this.pl = pl;
    this.reader = null;
    this.state = null;
    this.atr = null;
    this.protocol = null;

    pl.once('reader', this.onReader.bind(this));
  }

  close() {
    this.reader.close();
    this.pl.close();
  }

  onReader(reader) {
    this.reader = reader;
    this.readerConnect = reader.connect.bind(reader);
    this.readerConnectP = promisify(this.readerConnect);
    this.readerDisconnect = reader.disconnect.bind(reader);
    this.readerDisconnectP = promisify(this.readerDisconnect);
    this.readerTransmit = reader.transmit.bind(reader);
    this.readerTransmitP = promisify(this.readerTransmit);

    reader.on('error', this.onReaderError.bind(this));
    reader.on('status', this.onReaderStatus.bind(this));
  }

  onReaderError(err) {
    this.emit('error', err);
  }

  onReaderStatus(status) {
    this.state = status.state;
    this.atr = status.atr;

    if (this.state & this.reader.SCARD_STATE_PRESENT) {
      this.emit('state', 'present');
    }
  }

  isCardPresent() {
    if (!this.reader) {
      return false;
    }

    return !!(this.state & this.reader.SCARD_STATE_PRESENT);
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
          } else if (Date.now() - start < timeout) {
            setTimeout(handler, 100);
          } else {
            reject(new Error('wait for card timeout'));
          }
        };
        handler();
      }
    });
  }

  async connect(options) {
    if (this.protocol !== null) {
      return this.protocol;
    }

    const protocol = await this.readerConnectP(options);
    this.protocol = protocol;

    return protocol;
  }

  disconnect(disposition) {
    return this.readerConnectP(disposition);
  }

  transmit(message, bl) {
    if (!this.protocol) {
      throw new Error('not connected');
    }
    return this.readerTransmitP(message, bl, this.protocol);
  }
}
