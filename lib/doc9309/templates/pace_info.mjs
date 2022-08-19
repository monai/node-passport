// Doc 9309-11:2015 9.2.1 PACEInfo

// PACEInfo ::= SEQUENCE {
//   Protocol OBJECT IDENTIFIER(
//     id-PACE-DH-GM-3DES-CBC-CBC |
//     id-PACE-DH-GM-AES-CBC-CMAC-128 |
//     id-PACE-DH-GM-AES-CBC-CMAC-192 |
//     id-PACE-DH-GM-AES-CBC-CMAC-256 |
//     id-PACE-ECDH-GM-3DES-CBC-CBC |
//     id-PACE-ECDH-GM-AES-CBC-CMAC-128 |
//     id-PACE-ECDH-GM-AES-CBC-CMAC-192 |
//     id-PACE-ECDH-GM-AES-CBC-CMAC-256 |
//     id-PACE-DH-IM-3DES-CBC-CBC |
//     id-PACE-DH-IM-AES-CBC-CMAC-128 |
//     id-PACE-DH-IM-AES-CBC-CMAC-192 |
//     id-PACE-DH-IM-AES-CBC-CMAC-256 |
//     id-PACE-ECDH-IM-3DES-CBC-CBC |
//     id-PACE-ECDH-IM-AES-CBC-CMAC-128 |
//     id-PACE-ECDH-IM-AES-CBC-CMAC-192 |
//     id-PACE-ECDH-IM-AES-CBC-CMAC-256
//     id-PACE-ECDH-CAM-AES-CBC-CMAC-128 |
//     id-PACE-ECDH-CAM-AES-CBC-CMAC-192 |
//     id-PACE-ECDH-CAM-AES-CBC-CMAC-256
//   ),
//   version INTEGER, -- MUST be 2
//   parameterId INTEGER OPTIONAL
// }

const template = {
  0x31: {
    description: 'SET OF SecurityInfo',
    children: {
      0x30: {
        description: 'PACEInfo',
      },
    },
  },
};

export default template;
