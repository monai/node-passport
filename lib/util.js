const forge = require('node-forge');

module.exports = {
  toBuffer,
  toForgeBuffer,
};

function toBuffer(forgeBuffer) {
  return Buffer.from(forgeBuffer.getBytes(), 'binary');
}

function toForgeBuffer(buffer) {
  return forge.util.createBuffer(buffer.toString('binary'));
}
