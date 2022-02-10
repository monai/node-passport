module.exports = map;

function map(filename) {
  return filename.replace(/__test__\/(.+\.js)$/, '$1');
}
