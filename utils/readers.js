const fs = require('fs');
const {storeScore} = require('./../db/mongo-ops');

//Regular expression generator for given (opening) html tag.
//Case-insensitive.
//Checks for a > symbol OR a space (in case of attributes) after tag name.
const tagFinder = tag => new RegExp('[^\\w\\s/>]' + tag + '[\\s>]', 'gi');

//Map of scoreable tags and their values.
let tags = new Map([
  ['div', 3],
  ['p', 1],
  ['h1', 3],
  ['h2', 2],
  ['html', 5],
  ['body', 5],
  ['header', 10],
  ['footer', 10],
  ['font', -1],
  ['center', -2],
  ['big', -2],
  ['strike', -1],
  ['tt', -2],
  ['frameset', -5],
  ['frame', -5]
]);

//Promise chainable function to parse given html file as a string.
//Resolves as that string or rejects as an error.
function readAsync (filePath) {
  return new Promise ((res, rej) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        rej(err);
      }
      res(data);
    });
  });
}

//Promise chainable function to score a given html file.
//Uses tags map and regexp generator above to calculate said score.
//Resolves as that score or throws an error.
//Always called/returned as part of a larger chain with its own catch.
function scorerAsync (fileName) {
  let score = 0;
  return readAsync('./data/' + fileName + '.html').then(data => {
    //Iterates through map, checking/scoring for each tag.
    tags.forEach((value, key) => {
      let instances = data.match(tagFinder(key));
      //Only change the value of score if one or more instances of tag found.
      if (instances) {
        score += instances.length * value;
        // Uncomment line below to see breakdown of found tags and sub-scores for each scored file.
        // console.log(`Found ${instances.length} ${key} tags for ${instances.length * value} points.`);
      }
    });

    return score;
  }).catch(e => {
    throw new Error(`Error reading file '${fileName}.html.'`);
  });
}

//Uses fs.readdir to process all files in ./data.
//Each filename in the resulting array is trimmed of its .html extension.
//Then, each file is scored and stored in the second .then() block's loop.
function readAllAsync () {

  return new Promise ((res, rej) => {
    fs.readdir('./data', (err, files) => {
      if (err) {
        rej(err);
      }
      let fileNames = files.map((file) => file.match(/([\w-]+).html/)[1]);
      res(fileNames);
    });

  }).then(fileNames => {
    for (let fileName of fileNames) {
      scorerAsync(fileName)
        .then(score => storeScore(score, fileName))
        .catch(err => {
          console.log(err);
        });
    }
    //Obviously resolves before scorerAsync and storeScore calls clear from call stack,
    //but not an issue since no need to pass a value on to subsequent block.
    return;

  }).catch(err => {
    console.log(err);
  });
}

module.exports = {
  scorerAsync,
  readAllAsync,
  readAsync
}
