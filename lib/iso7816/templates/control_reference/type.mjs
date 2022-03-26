// ISO/IEC 7816-4:2013
// 10.3.1 Control reference templates

export const type = {
  at: 'authentication',
  kat: 'key agreement',
  ht: 'hash-code',
  cct: 'cryptographic checksum',
  dst: 'digital signature',
  ct: 'confidentiality',
  ctSym: 'confidentiality using symmetric cryptographic techniques',
  ctAsym: 'confidentiality using asymmetric cryptographic techniques',
};

export default type;
