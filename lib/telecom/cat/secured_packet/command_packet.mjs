// ETSI TS 102 225 V16.0.0 (2020-06)
// 5.1 Command packet structure

import { decode as decodeLength } from '../../../asn1/ber/length.mjs';
import { decode as decodeSpi } from './spi.mjs';
import { decode as decodeKic } from './kic.mjs';
import { decode as decodeKid } from './kid.mjs';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data, options) {
  const cpi = data[0];
  data = data.slice(1);

  const decodeCpl = options?.decodeCpl ?? decodeLength;
  const [cpl, cplr] = decodeCpl(data);
  data = data.slice(cplr);

  const decodeChi = options?.decodeChi ?? ((d) => [d[0], 1]);
  const [chi, chir] = decodeChi(data);
  data = data.slice(chir);

  const decodeChl = options?.decodeChl ?? decodeLength;
  const [chl, chlr] = decodeChl(data);
  data = data.slice(chlr);

  const spiBytes = data.slice(0, 2);
  const spi = decodeSpi(spiBytes);
  data = data.slice(2);

  const kicBytes = data.slice(0, 1);
  const kic = decodeKic(kicBytes);
  data = data.slice(1);

  const kidBytes = data.slice(0, 1);
  const kid = decodeKid(kidBytes, spi.B1b2b1);
  data = data.slice(1);

  const tar = data.slice(0, 3);
  data = data.slice(3);

  const cntr = data.slice(0, 5);
  data = data.slice(5);

  const pcntr = data.slice(0, 1);
  data = data.slice(1);

  const rcccdsl = chl - 13;
  const rcccds = data.slice(0, rcccdsl);
  data = data.slice(rcccdsl);

  const out = {
    cpi,
    cpl,
    chi,
    chl,
    spiBytes,
    spi,
    kicBytes,
    kic,
    kidBytes,
    kid,
    tar,
    tarString: tar.toString(),
    cntr,
    pcntr,
    rcccds,
    securedDataLength: data.length,
    securedData: data,
  };

  return out;
}
