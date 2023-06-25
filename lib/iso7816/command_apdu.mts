// ISO/IEC 7816-4:2013(E)

import { inspect } from 'util';

export enum FieldLength {
  Short = 'SHORT',
  Extended = 'EXTENDED',
}

export interface CommandApduOptions {
  data?: Buffer | string;
  le?: number;
  sm?: boolean;
}

export default class CommandApdu {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  data?: Buffer;
  le?: number;

  sm = false;

  static from(data: Buffer | string) {
    if (typeof data === 'string') {
      data = Buffer.from(data, 'hex');
    }

    if (data.length < 4) {
      throw new RangeError(`The length of "data" is out of range. It must be >= 4. Received ${data.length}`);
    }

    let offset = 0;

    const [cla, ins, p1, p2] = data;
    offset += 4;

    let lc;
    let cdata;
    let le;
    if (data.length > 5 && data[offset] === 0x00) {
      // extended
      offset += 1;
      if (data.length - offset > 2) {
        lc = data.subarray(offset).readUInt16BE();
        offset += 2;

        cdata = data.subarray(offset, offset + lc);
        offset += lc;
      }

      if (data.length - offset === 2) {
        le = data.subarray(offset).readUInt16BE();
        le = le === 0 ? 0x10000 : le;
      }
    } else if (data.length > 4) {
      // short
      if (data.length - offset > 1) {
        lc = data.subarray(offset).readUInt8();
        offset += 1;

        cdata = data.subarray(offset, offset + lc);
        offset += lc;
      }

      if (data.length - offset === 1) {
        le = data.subarray(offset).readUInt8();
        le = le === 0 ? 0x100 : le;
      }
    }

    const options: CommandApduOptions = {};
    if (cdata) {
      options.data = cdata;
    }
    if (le !== undefined) {
      options.le = le;
    }

    return new this(cla, ins, p1, p2, options);
  }

  constructor(cla: number, ins: number, p1: number, p2: number, options: CommandApduOptions = {}) {
    this.cla = cla;
    this.ins = ins;
    this.p1 = p1;
    this.p2 = p2;

    // 7816-4 Table 2 — First interindustry values of CLA
    // 0b00xx: No SM or no indication
    // 0b01xx: Proprietary SM format
    // 0b10xx: SM according to clause 10, command header not processed according to 10.2.3.1
    // 0b11xx: SM according to clause 10, command header authenticated according to 10.2.3.1
    if (cla & 0x08 || cla & 0x0c || options.sm) {
      this.sm = true;
    }

    if (options.data) {
      if (typeof options.data === 'string') {
        options.data = Buffer.from(options.data, 'hex');
      }

      if (options.data.length > 0xffff) {
        throw new RangeError(`The length of "data" is out of range. It must be >= 0 and <= 65535. Received ${options.data.length}`);
      }

      this.data = options.data;
    }

    // TODO: throw error if le === 0
    // 7816-4 Table 1
    // Field: Le field
    // Description: Absent for encoding Ne = 0, present for encoding Ne > 0
    if ((options.le ?? -1) > 0x10000) {
      throw new RangeError(`The value of "le" is out of range. It must be >= 0 and <= 65536. Received ${options.le}`);
    }

    this.le = options.le;
  }

  // 7816-4 5.2
  // In any command APDU comprising both Lc and Le fields (see ISO/IEC 7816-3),
  // short and extended length fields shall not be combined: either both of them are short,
  // or both of them are extended.
  get fieldLength() {
    return (
      (this.data?.length ?? -1) > 0xff || (this.le ?? -1) > 0x100
    ) ? FieldLength.Extended : FieldLength.Short;
  }

  get shortField() {
    return this.fieldLength === FieldLength.Short;
  }

  get extendedField() {
    return this.fieldLength === FieldLength.Extended;
  }

  toBuffer() {
    return Buffer.concat([
      this.getEncodedHeader(),
      this.getEncodedLc(),
      this.data,
      this.getEncodedLe(),
    ].filter((x): x is Buffer => !!x));
  }

  getEncodedHeader() {
    return Buffer.from([
      this.cla,
      this.ins,
      this.p1,
      this.p2,
    ]);
  }

  getEncodedLc() {
    if (!this.data) {
      return undefined;
    }

    if (this.shortField) {
      return Buffer.from([this.data.length]);
    }

    const lc = Buffer.alloc(3);
    lc.writeUInt16BE(this.data.length, 1);
    return lc;
  }

  getEncodedLe() {
    if (this.sm) {
      if (this.shortField) {
        return Buffer.alloc(this.data ? 1 : 2);
      }

      return Buffer.alloc(this.data ? 2 : 3);
    }

    if (!this.le) {
      return undefined;
    }

    if (this.le > 0) {
      if (this.shortField) {
        if (this.le < 0x100) {
          return Buffer.from([this.le]);
        }

        if (this.le === 0x100) {
          return Buffer.from([0x00]);
        }
      }

      const le = Buffer.alloc(this.data ? 2 : 3);
      const offset = this.data ? 0 : 1;
      if (this.le < 0x10000) {
        le.writeUInt16BE(this.le, offset);
      }
      return le;
    }

    return undefined;
  }

  toString() {
    return this.toBuffer().toString('hex');
  }

  toDebugString() {
    return [
      this[Symbol.toStringTag],
      this.data && this.data.toString('hex'),
    ].filter(Boolean).join(' ');
  }

  get [Symbol.toStringTag]() {
    const lc = this.getEncodedLc()?.toString('hex');
    const le = this.getEncodedLe()?.toString('hex');

    return [
      this.getEncodedHeader().toString('hex'),
      lc && `lc:${lc}`,
      le && `le:${le}`,
    ].filter(Boolean).join(' ');
  }

  [inspect.custom]() {
    return `<${this.constructor.name} ${this.toDebugString()}>`;
  }
}
