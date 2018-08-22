const resChecker = require('./../res-checker');
const expect = require('expect');

describe('resChecker', () => {
  it('should throw an error for empty array', () => {
    expect(() => {
      resChecker([], 'index');
    }).toThrow();
  });

  it('should return undefined for an array of one or more items', () => {
    expect(resChecker(['a', 'b'], 'index')).toBeUndefined();
  });
});
