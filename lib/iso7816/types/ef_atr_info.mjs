// ISO/IEC 7816-4:2013(E)
// 12.1.1 Historical bytes

import extendedLengthInformation from './extended_length_information.mjs';
import * as cardServiceData from '../dos/card_service_data.mjs';
import * as initialAccessData from '../dos/initial_access_data.mjs';
import * as cardCapabilities from '../dos/card_capabilities.mjs';

const type = {
  singleComponentType: true,
  children: [
    {
      description: 'Object identifier',
      tag: 0x06,
    },
    {
      description: 'Country code',
      tag: 0x41,
    },
    {
      description: 'Issuer identification number and optional issuer data',
      tag: 0x41,
    },
    {
      description: 'Card service data',
      tag: 0x43,
      ...cardServiceData,
    },
    {
      description: 'Initial access data',
      tag: 0x44,
      ...initialAccessData,
    },
    {
      description: "Card issuer's data",
      tag: 0x45,
    },
    {
      description: 'Pre-issuing data',
      tag: 0x46,
    },
    {
      description: 'Card capabilities',
      tag: 0x47,
      ...cardCapabilities,
    },
    {
      description: 'Application Family Identifier',
      tag: 0x49,
    },
    {
      description: 'Application identifier',
      tag: 0x4f,
    },
    extendedLengthInformation,
  ],
};

export default type;
