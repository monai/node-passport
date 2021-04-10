class LengthError extends RangeError {
  constructor(expected, received) {
    super(`The length of data is out of range. It must be at least ${expected}. Received ${received}`);
  }
}

module.exports = LengthError;
