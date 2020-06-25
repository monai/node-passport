module.exports = {
  formatHex,
};

function formatHex(number) {
  const str = number.toString(16);
  return str.length % 2 ? `0${str}` : str;
}
