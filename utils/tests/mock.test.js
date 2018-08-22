const mockMaker = require('./../mock');
const expect = require('expect');

describe('mockMaker', () => {
  it('should return a mock function that returns/captures any value passed to it', () => {
    const mock = mockMaker();
    expect(typeof mock).toBe('function');
    mock('foo');
    mock('baz');
    expect(mock(45)).toBe(45);
    expect(mock.cache.get(2)).toBe('baz');
  });
});
