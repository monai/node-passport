import template from './generic.mjs';
import fcp from '../fcp/dedicated_file.mjs';

template[0x62].children = fcp;

export default template;
