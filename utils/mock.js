function mockMaker(func) {
  function wrapper(value) {
    wrapper.cache.set(call, value);
    call += 1;
    return value;
  }
  let call = 1;
  wrapper.cache = new Map();

  return wrapper;
}

module.exports = mockMaker;
