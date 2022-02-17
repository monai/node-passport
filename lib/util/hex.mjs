export default function hex(strings) {
  return Buffer.from(strings.join('').replace(/[^a-f0-9]/ig, ''), 'hex');
}
