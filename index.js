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
  //The "npm start" script points to this case, which displays text instructions.
  case 'help':
    showHelp();
    return;

  //Score and store in the DB all files in ./data OR only those named on command line.
  case 'score':
    if (args.all) {
      //Score all files currently in ./data.
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

  //Return (a date-range-defined section of) all scores by filename from DB.
  case 'all':
    //Process input from --sd and --ed flags (if any).
    let [start, end] = getBounds(args);
    //Pass date bounds (if any) in ms-since-UNIX-epoch timestamps to insert function.
    getAllScores(start, end);
    return;

  //Get data (high, low, avg) on a given file from the DB.
  case 'get':

    let fileName = args._[0];

    //Simple validator in case no filename provided.
    if (!fileName) {
      console.log('Please enter a valid filename.');
      return;
    }
    //Control flow for --avg/--high/--low flags.
    if (args.avg) {
      //Retrieve average score for a given file from the DB.
      getAverage(fileName);

    } else if (args.high) {
      //Retrieve most recent instance of highest score for a given file from the DB.
      getHigh(fileName);
      return;

    } else if (args.low) {
      //Retrieve most recent instance of lowest score for a given file from the DB.
      getLow(fileName);
      return;

    } else {
      return;
    }

  //Return if none of the cases above are satisfied.
  default:
    console.log('Please enter a valid command. Run "npm start" for help.');
    return;
}
