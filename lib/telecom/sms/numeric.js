// ETSI TS 123 040 V16.0.0 (2020-07)

module.exports = {
  decode,
};

// 9.1.2.2 Octet representation
// 9.1.2.3 Semi-octet representation
function decode(data) {
  let out = 0;

  for (const digit of data) {
    out *= 10;
    out += digit;
  }

  return out;
}
