import { createCipheriv, createDecipheriv } from 'crypto';
import { aesCmac } from 'node-aes-cmac';
import { mac as iso9797Mac, pad, unpad } from '../iso9797.mjs';
import ab2aba from '../util/ab2aba.mjs';

const desIv = () => Buffer.alloc(8);
const aesIv = (algorithm) => (kEnc, SSC) => {
  const cipher = createCipheriv(algorithm, kEnc, Buffer.alloc(16));
  return cipher.update(SSC);
};
const desSsc = () => Buffer.alloc(8);
const aesSsc = () => Buffer.alloc(16);
const cmac = (key, data) => aesCmac(key, data, { returnAsBuffer: true });

class Session {
  // Doc 9309-11 9.8.6, 9.8.7
  static algorithms = {
    'des-ede3-cbc': {
      blockSize: 8,
      iv: desIv,
      mac: iso9797Mac,
      ssc: desSsc,
    },
    'aes-128-cbc': {
      blockSize: 16,
      iv: aesIv('aes-128-cbc'),
      mac: cmac,
      macLength: 8,
      ssc: aesSsc,
    },
    'aes-192-cbc': {
      blockSize: 16,
      iv: aesIv('aes-192-cbc'),
      mac: cmac,
      macLength: 8,
      ssc: aesSsc,
    },
    'aes-256-cbc': {
      blockSize: 16,
      iv: aesIv('aes-256-cbc'),
      mac: cmac,
      macLength: 8,
      ssc: aesSsc,
    },
  };

  constructor(algorithm, kEnc, kMac, ssc) {
    this.algorithm = algorithm;
    if (algorithm === 'des-ede3-cbc') {
      this.kEnc = (kEnc.length !== 24) ? ab2aba(kEnc) : kEnc;
      this.kMac = (kMac.length !== 24) ? ab2aba(kMac) : kMac;
    } else {
      this.kEnc = kEnc;
      this.kMac = kMac;
    }

    this.options = this.constructor.algorithms[algorithm];
    if (!this.options) {
      throw new Error(`Unknown algorithm ${algorithm}`);
    }

    this.setSSC(ssc ?? this.options.ssc());
  }

  encrypt(data) {
    const iv = this.options.iv(this.kEnc, this.ssc);
    const cipher = createCipheriv(this.algorithm, this.kEnc, iv);
    return cipher.update(data);
  }

  decrypt(data) {
    const iv = this.options.iv(this.kEnc, this.ssc);
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

  verify(data, mac) {
    return mac.equals(this.authenticate(data));
  }

  setSSC(ssc) {
    this.ssc = ssc;
  }

  resetSSC() {
    this.ssc = Buffer.alloc(this.options.blockSize);
  }

  incrementSSC(n = 1n) {
    const tmp = this.ssc.readBigUInt64BE(8) + n;
    const ssc = Buffer.alloc(this.ssc.length);
    ssc.writeBigUInt64BE(tmp, 8);
    this.ssc = ssc;
  }

  decrementSSC(n = 1n) {
    this.incrementSSC(-n);
  }

  addPadding(data) {
    return pad(this.options.blockSize, data);
  }

  removePadding(data) {
    return unpad(this.options.blockSize, data);
  }
}

export default Session;
