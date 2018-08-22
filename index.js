//Use minimist args object to power CLI logic below.
const args = require('minimist')(process.argv.slice(2));

//Local utils
const showHelp = require('./utils/show-help');
const {scorerAsync, readAllAsync} = require('./utils/readers');
const getBounds = require('./utils/get-bounds');

//MongoDB operations
const {storeScore, getAllScores, getHigh, getLow, getAverage} = require('./db/mongo-ops');

//The m (mode) flag, built into package.json scripts, drives the CLI logic.
switch(args.m) {
  case 'help':
    showHelp();
    return;

  case 'score':
    if (args.all) {
      return readAllAsync();
    } else {
      //Run the scorer function for as many filenames as are provided...
      for (let fileName of args._) {
        scorerAsync(fileName)
          .then(score => storeScore(score, fileName))
          .catch(e => console.log(e));
      }
      // ...or not at all if args._ is empty.
      return;
    }

  case 'all':
    let [start, end] = getBounds(args);
    getAllScores(start, end);
    return;

  case 'get':

    let fileName = args._[0];

    if (!fileName) {
      console.log('Please enter a valid filename.');
      return;
    }

    if (args.avg) {
      getAverage(fileName);

    } else if (args.high) {
      getHigh(fileName);
      return;

    } else if (args.low) {
      getLow(fileName);
      return;

    } else {
      return;
    }

  default:
    return;
}
