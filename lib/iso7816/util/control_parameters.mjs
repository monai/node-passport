import templates from '../templates/fci.mjs';
import parseObject from '../../asn1/util/parse_object.mjs';

export default function controlParameters(data) {
  return parseObject(data, { template: templates }).fcp;
}
