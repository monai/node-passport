const deviceIdentities = require('./device_identities');
const address = require('./address');

module.exports = {
  0x02: deviceIdentities,
  0x82: deviceIdentities,
  0x06: address,
  0x86: address,
};
