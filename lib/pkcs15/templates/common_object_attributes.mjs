// ISO/IEC 7816-15:2016(E)
// 8.2.8 CommonObjectAttributes; -- A.2.8

const template = {
  0x0c: {
    name: 'label',
  },
  0x03: {
    name: 'flags',
  },
  0x04: {
    name: 'authId',
  },
  0x02: {
    name: 'userConsent',
  },
  0x30: {
    name: 'accessControlRules',
  },
  0x0a: {
    name: 'currentLCS',
  },
};

export default template;
