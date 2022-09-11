export default function bitReverse(byte) {
  return (((byte * 0x0802 & 0x22110) | (byte * 0x8020 & 0x88440)) * 0x10101 >> 16) & 0xff;
}
