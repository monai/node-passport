const { authenticate, computeSessionKeys, computeSsc } = require('./bac');
const CommandApdu = require('../iso7816/CommandApdu');
const Session = require('./Session');

module.exports = performBac;

async function performBac(reader, keys) {
  const options = {
    keys,
  };
  let apdu;
  let response;

  // GET CHALLENGE
  apdu = new CommandApdu(0x00, 0x84, 0x00, 0x00, { le: 0x08 });
  response = await reader.transmit(apdu.toBuffer(), 10);
  options.rndIc = response.slice(0, 8);
  Object.assign(options, await authenticate(options));

  const data = Buffer.concat(options.keysIfd);
  // EXTERNAL(/MUTUAL) AUTHENTICATE
  apdu = new CommandApdu(0x00, 0x82, 0x00, 0x00, { data, le: 0x28 });
  response = await reader.transmit(apdu.toBuffer(), 42);
  options.keysIc = response;

  const [ksEnc, ksMac] = computeSessionKeys(options);
  const ssc = computeSsc(options);

  return new Session('des-ede3-cbc', ksEnc, ksMac, ssc);
}
