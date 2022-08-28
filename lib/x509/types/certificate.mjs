// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

import { create as createSigned } from './signed.mjs';
import tbsCertificate from './tbs_certificate.mjs';

const type = createSigned({ toBeSigned: tbsCertificate });

export default type;
