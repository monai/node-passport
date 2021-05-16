module.exports = {
  encode,
  decode,
  inspect: decode,
};

function encode() {

}

function decode(data) {
  return data[0] > 0;
}
