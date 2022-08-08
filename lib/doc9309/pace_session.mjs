import eac from '@monai/pace';

const { SM } = eac;

export default class PaceSession {
  constructor(context) {
    this.context = context;
  }

  encrypt(data) {
    return SM.encrypt(this.context, data);
  }

  decrypt(data) {
    return SM.decrypt(this.context, data);
  }

  authenticate(data) {
    return SM.authenticate(this.context, data);
  }

  verify(data, mac) {
    return SM.verify(this.context, data, mac);
  }

  increment() {
    return SM.incrementSSC(this.context);
  }
}
