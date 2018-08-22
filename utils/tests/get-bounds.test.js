const getBounds = require('./../get-bounds');
const expect = require('expect');

describe('getBounds', () => {
  it('should output an array of two thirteen digit timestamps', () => {
    const boundsObj = {
      sd: '2018-08-20',
      ed: '2018-08-21'
    };
    const bounds = getBounds(boundsObj);
    expect(bounds).toHaveLength(2);
    expect(bounds[1] - bounds[0]).toBe(1000 * 60 * 60 * 24);
    expect(bounds[0]).toBe(new Date(boundsObj.sd).getTime());
    expect(bounds[1]).toBe(new Date(boundsObj.ed).getTime());
  });

  it('should output an array of the same format for trimmed input', () => {
    const bounds = getBounds({sd: '2017', ed: '2018'});
    expect(bounds).toHaveLength(2);
    expect(bounds[1] - bounds[0]).toBe(1000 * 60 * 60 * 24 * 365);
  });

  it('should return an array of [null, null] for null inputs', () => {
    const bounds = getBounds({sd: null, ed: null});
    expect(bounds).toEqual([null, null]);
  })
});
