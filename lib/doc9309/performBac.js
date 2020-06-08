const { authenticate, computeSessionKeys } = require('./bac');
const { CommandApdu } = require('../iso7816/apdu');

module.exports = performBac;

async function performBac(reader, keys) {
  const options = {
    keys,
  };
  let apdu, res;

  apdu = new CommandApdu(0x00, 0x84, 0x00, 0x00, { le: 0x08 });
  res = await reader.transmit(apdu.toBuffer(), 10);
  options.rndIc = res.slice(0, 8);
  Object.assign(options, await authenticate(options));

  const data = Buffer.concat(options.keysIfd);
  apdu = new CommandApdu(0x00, 0x82, 0x00, 0x00, { data, le: 0x28 });
  res = await reader.transmit(apdu.toBuffer(), 42);
  options.keysIc = res;

  const [ksEnc, ksMac, ssc] = computeSessionKeys(options);
  return {
    ksEnc,
    ksMac,
    ssc,
  };
}
