export default function hex(strings, ...args) {
  const buf = [];
  for (const [n, str] of strings.entries()) {
    buf.push(str);

    if (n < args.length) {
      buf.push(args[n]);
    }
  }

  return Buffer.from(buf.join('').replace(/[^a-f0-9]/ig, ''), 'hex');
}
