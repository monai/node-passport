const iconv = require('iconv-lite');

module.exports = {
  encode,
  decode,
  inspect: decode,
};

function encode() {

}

function decode(data) {
  return iconv.decode(data, 'utf16-be');
}
