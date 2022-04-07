// ISO/IEC 7816-4:2013
// Table 17 — Coding of the sole byte in an access mode field for DFs
// Table 29 — Coding of the 3rd byte in an access mode field (2nd AMB) for DOs

import { dedicatedFile, elementaryFile, dataObject } from '../../../../data_structure.mjs';

const type = {
  dedicatedFile,
  elementaryFile,
  dataObject,
  securityObject: 'securityObject',
  tableAndView: 'tableAndView',
};

export default type;
