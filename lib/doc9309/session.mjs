import { createCipheriv, createDecipheriv } from 'crypto';
import { mac as iso9797Mac } from '../iso9797.mjs';
import ab2aba from '../util/ab2aba.mjs';

const aesEncIv = () => {};
const cmac = () => { throw new Error('Not implemented'); };

class Session {
  // Doc 9309-11 9.8.6, 9.8.7
  static algorithms = {
    'des-ede3-cbc': {
      cipherIv: () => Buffer.alloc(8),
      mac: iso9797Mac,
    },
    'aes-128-cbc': {
      cipherIv: aesEncIv,
      mac: cmac,
      macLength: 8,
    },
    'aes-192-cbc': {
      cipherIv: aesEncIv,
      mac: cmac,
      macLength: 8,
    },
    'aes-256-cbc': {
      cipherIv: aesEncIv,
      mac: cmac,
      macLength: 8,
    },
  };

  constructor(algorithm, kEnc, kMac, ssc) {
    this.algorithm = algorithm;
    if (algorithm === 'des-ede3-cbc') {
      this.kEnc = (kEnc.length !== 24) ? ab2aba(kEnc) : kEnc;
      this.kMac = (kMac.length !== 24) ? ab2aba(kMac) : kMac;
    }
    this.ssc = ssc;

    this.options = this.constructor.algorithms[algorithm];
    if (!this.options) {
      throw new Error(`Unknown algorithm ${algorithm}`);
    }
  }

  encrypt(data) {
    const iv = this.options.cipherIv(this.kEnc, this.ssc);
    const cipher = createCipheriv(this.algorithm, this.kEnc, iv);
    return cipher.update(data);
  }

  decrypt(data) {
    const iv = this.options.cipherIv(this.kEnc, this.ssc);
    const decipher = createDecipheriv(this.algorithm, this.kEnc, iv);
    return decipher.update(Buffer.concat([
      data,
      Buffer.alloc(8 - (data.length % 8)),
    ]));
  }

  authenticate(data) {
    const N = Buffer.concat([this.ssc, data]);
    return this.options.mac(this.kMac, N).slice(0, this.options.macLength);
  }

  increment(n = 1n) {
    const tmp = this.ssc.readBigUInt64BE() + n;
    const ssc = Buffer.alloc(8);
    ssc.writeBigUInt64BE(tmp);
    this.ssc = ssc;
  }

  decrement(n = 1n) {
    this.increment(-n);
  }
}

export default Session;
