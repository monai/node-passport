export default class Asn1Error extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
