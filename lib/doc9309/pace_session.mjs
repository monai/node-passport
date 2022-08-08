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

  setSSC(ssc) {
    return SM.setSSC(this.context, ssc);
  }

  resetSSC() {
    return SM.resetSSC(this.context);
  }

  incrementSSC() {
    return SM.incrementSSC(this.context);
  }

  addPadding(data) {
    return SM.addPadding(this.context, data);
  }

  // eslint-disable-next-line class-methods-use-this
  removePadding(data) {
    return SM.removePadding(data);
  }
}
