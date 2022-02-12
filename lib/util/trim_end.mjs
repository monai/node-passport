export default function trimEnd(data, predicate) {
  let l = data.length;
  // eslint-disable-next-line no-plusplus
  while (l--) {
    if (predicate(data[l])) {
      break;
    }
  }
  return data.slice(0, l + 1);
}
