const fs = require('fs');
const expect = require('expect');

//Test these two reader functions as they are...
const {scorerAsync, readAsync} = require('./../readers');

//...but use mock-making function to aid in testing of readAllAsync below.
const mockMaker = require('./../mock');

describe('readAsync', () => {
  it('should resolve as a string when passed a valid html file path', () => {
    return readAsync('./data/index.html').then(data => {
      expect(typeof data).toBe('string');
    });
  });

  it('should reject as an error when passed an invalid path', () => {
    return readAsync('index.html').catch(e => expect(e).toBeTruthy());
  });

  it('should also reject when passed a path to a non-existing file', () => {
    return readAsync('./data/bogus.html').catch(e => expect(e).toBeTruthy());
  });
});

describe('scorerAsync', () => {
  it('should return an integer for a valid filename in ./data', () => {
    return scorerAsync('index').then(score => {
      expect(typeof score).toBe('number');
    });
  });

  //re: ./data/bad.html
  it('should properly score a file even in the case of certain html errors', () => {
    return scorerAsync('bad').then(score => {
      //html x 1 = 5
      //body x 1 = 5
      //p x 2 = 2
      //big x 1 = -2
      //div x 1 = 3

      //Ignores tag names (center, frameset, div, ) appearing inside text nodes/class attributes, too.

      //total = 13
      expect(score).toBe(13);
    });
  });
});

//Create mocks to plant inside readAllAsync.
const firstBlock = mockMaker();
const storeScore = mockMaker();

//Pass function with mocks to test case below.
function readAllAsync () {

  return new Promise ((res, rej) => {
    fs.readdir('./data', (err, files) => {
      if (err) {
        rej(err);
      }
      let fileNames = files.map((file) => file.match(/([\w-]+).html/)[1]);
      //Capture return value of first resolved Promise.
      res(firstBlock(fileNames));
    });

  }).then(fileNames => {
    for (let fileName of fileNames) {
      scorerAsync(fileName)
        //Mock out db write method and capture all scores in cache instead.
        .then(score => storeScore(score))
        .catch(err => {
          console.log(err);
        });
    }

    return;
  }).catch(err => {
    console.log(err);
  });
}

describe('readAllAsync', () => {
  it('should pass an array of filenames to a loop of scorerAsync calls', (done) => {
    readAllAsync().then(() => {
      expect(firstBlock.cache.size).toBe(1);
      expect(firstBlock.cache.get(1)).toHaveLength(10);
      //Force final assertion to wait in the back of the queue.
      //Otherwise, it clears from the call stack before looped calls of scorerAsync and storeScore,
      //and thus the test fails (expected 0 to be 10).
      setTimeout(() => {
        expect(storeScore.cache.size).toBe(10);
        done();
      }, 25);
    }).catch(e => done(e));
  });
});
