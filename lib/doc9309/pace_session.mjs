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

  mac(data) {
    return SM.authenticate(this.context, data);
  }

  increment() {
    return SM.incrementSSC(this.context);
  }
}
