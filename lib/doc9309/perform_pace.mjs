import eac from '@monai/pace';
import CommandApdu from '../iso7816/command_apdu.mjs';
import { assertSwOk } from '../iso7816/util.mjs';
import tlv from '../asn1/tlv.mjs';
import { encode as encodeOid } from '../asn1/codecs/object_identifier.mjs';
import PaceSession from './pace_session.mjs';

export default async function performPace(reader, options) {
  const {
    password,
    passwordType,
    reference,
    protocol,
    standardizedDomainParametersId,
  } = options;

  const secret = new eac.SharedSecret(password, eac[`NID_${passwordType}`]);

  const context = new eac.Context();
  context.initPACE(eac[`NID_${protocol}`], standardizedDomainParametersId);

  let data;
  let apdu;
  let res;

  // MSE: SET
  // 7816-4, Table 55
  // 80 (Cryptographic mechanism reference):
  //   Mechanism OID
  // 83 (Reference):
  //   0x01: MRZ
  //   0x02: CAN
  //   0x03: PIN
  //   0x04: PUK
  const mechanismValue = encodeOid(eac[protocol].split('.').map(BigInt));
  const referenceValue = Buffer.from([eac[`NID_${reference}`]]);

  const mechanismDo = tlv(0x80, mechanismValue);
  const referenceDo = tlv(0x83, referenceValue);
  data = Buffer.concat([mechanismDo, referenceDo]);
  apdu = new CommandApdu(0x00, 0x22, 0xc1, 0xa4, { data });
  res = await reader.transmit(apdu);
  assertSwOk(res);

  // => GENERAL AUTHENTICATE
  data = tlv(0x7c);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data, le: generalAuthenticateLe });

  // <= 7C: 80: Encrypted Nonce
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const encryptedNonce = res.data.slice(4);
  eac.PACE.step2DecryptNonce(context, secret, encryptedNonce);

  const pcdMappingData = eac.PACE.step3AGenerateMappingData(context);

  // => 7C: 81: PCD Mapping Data
  const pcdMappingDataDo = tlv(0x81, pcdMappingData);
  data = tlv(0x7c, pcdMappingDataDo);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data, le: 0x45 });

  // <= 7C: 82: PICC Mapping Data
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const piccMappingData = res.data.slice(4);
  eac.PACE.step3AMapGenerator(context, piccMappingData);

  const pcdEphemeralPublicKey = eac.PACE.step3BGenerateEphemeralKey(context);

  // => 7C: 83: PCD Ephemeral Public Key
  const pcdEphemeralPublicKeyDo = tlv(0x83, pcdEphemeralPublicKey);
  data = tlv(0x7c, pcdEphemeralPublicKeyDo);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data, le: 0x45 });

  // <= 7C: 84: PICC Ephemeral Public Key
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const piccEphemeralPublicKeyDo = res.data.slice(4);
  if (pcdEphemeralPublicKey.equals(piccEphemeralPublicKeyDo)) {
    throw new Error('PCD and IC ephemeral keys are equal');
  }

  eac.PACE.step3BComputeSharedSecret(context, piccEphemeralPublicKeyDo);
  eac.PACE.step3CDeriveKeys(context);

  const pcdToken = eac.PACE.step3DComputeAuthenticationToken(context, piccEphemeralPublicKeyDo);

  // => 7C: 85: PCD Authentication Token
  const pcdTokenDo = tlv(0x85, pcdToken);
  data = tlv(0x7c, pcdTokenDo);
  apdu = new CommandApdu(0x00, 0x86, 0x00, 0x00, { data, le: 0x0c });

  // <= 7C: 86: PICC Authentication Token
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const piccToken = res.data.slice(4);
  eac.PACE.step3DVerifyAuthenticationToken(context, piccToken);

  context.setSMContext(eac.EAC_ID_PACE);

  return new PaceSession(context);
}
