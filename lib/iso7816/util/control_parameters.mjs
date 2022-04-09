import templates from '../templates/file_control_information/fci/auto.mjs';
import parseObject from '../../asn1/util/parse_object.mjs';

export default function controlParameters(data) {
  return parseObject(data, { template: templates }).fcp;
}
