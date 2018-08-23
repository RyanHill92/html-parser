const {MongoClient} = require('mongodb');

//Mongo env variables direct all functions below to proper DB.
const {mongoUri, dbName, collName} = require('./mongo-config');

//Local utilities
const resChecker = require('./../utils/res-checker');
const {localTime, localDate, currentTimeZone, utcDate, utcTime} = require('./../utils/current-times');

//Core node module to ensure visibility of nested objects.
const util = require('util');

//House connection to DB in reusable function.
function connect () {
  return MongoClient.connect(mongoUri, {useNewUrlParser: true}).then(client => {
    return {
      db: client.db(dbName),
      client
    };
  }).catch(e => {
    console.log({message: 'Unable to connect to database!', error: e});
  });
}

//Ditto with closing out.
function close (client) {
  if (client) {
    client.close();
  }
}

//Insert run data, including score and fileName.
function storeScore (score, fileName) {
  let client = null;

  return connect().then(dbObj => {

    const {db} = dbObj;
    client = dbObj.client;

    //Util functions return convenient, readable fragments of date string
    //and meet schema validation requirements. Of the time/date fields, only timeStamp,
    //which reflects the UTC time and date, is used to calculate inclusion in custom date ranges.
    const run = {
      fileName,
      score,
      utcDate: utcDate(),
      utcTime: utcTime(),
      localDate: localDate(),
      localTime: localTime(),
      timeZone: currentTimeZone(),
      timeStamp: Date.now()
    };
    return db.collection(collName).insertOne(run);

  }).then(res => {
      close(client);
      console.log(`Stored run data for '${fileName}.html.' Score: ${res.ops[0].score}`);

  }).catch(err => {
      close(client);
      console.log(err);
  });
}

//Return a range of data from the DB on all scored files.
//Aggregation pipeline operators return one document per unique fileName,
//with a "scores" field equal to an array of unique score/date/time objects.
function getAllScores (start, end) {
  let client = null;

  return connect().then(dbObj => {

    const {db} = dbObj;
    client = dbObj.client;

    return db.collection(collName).aggregate([
      { $match:
        { timeStamp:
          { $gte: start || 0, $lte: end || Date.now() }
        }
      },
      { $sort:
        { timeStamp: -1 }
      },
      { $group:
        { _id: '$fileName',
          scores:
            { $push:
              {
                score: '$score',
                utcDate: '$utcDate',
                utcTime: '$utcTime',
                localDate: '$localDate',
                localTime: '$localTime'
              }
            }
        }
      }
    ]).toArray()

  }).then(runs => {
    close(client);
    if (runs.length === 0) {
      console.log('No scores recorded in given date range.');
    } else {
      console.log(
        util.inspect(runs, {
        compact: false,
        depth: 5,
        colors: true
        })
      );
    }
    return runs;
  }).catch(err => {
    console.log(err);
    close(client);
  });
}

//Return the most recent instance of a given file's highest score.
function getHigh (fileName) {
  let client = null;

  return connect().then(dbObj => {

    const {db} = dbObj;
    client = dbObj.client;

    return db.collection(collName).aggregate([
      { $match:
        { fileName }
      },
      { $sort:
        { timeStamp: 1 }
      },
      { $group:
        { _id: '$fileName',
          highScore: { $max: '$score' },
          localDate: {$last: '$localDate'},
          localTime: {$last: '$localTime'},
          utcDate: { $last: '$utcDate' },
          utcTime: { $last: '$utcTime' } }
      }
    ]).toArray();

  }).then(res => {
    resChecker(res, fileName);
    console.log(res);
    close(client);
    return res;
  }).catch(err => {
    console.log(err);
    close(client);
  });
}

//Return an average of all scores calculated for a given file.
function getAverage (fileName) {
  let client = null;

  return connect().then(dbObj => {

    const {db} = dbObj;
    client = dbObj.client;

    return db.collection(collName).aggregate([
      { $match:
        { fileName }
      },
      { $group:
        { _id: '$fileName', averageScore: { $avg: '$score' } }
      }
    ]).toArray()

  }).then(res => {
    resChecker(res, fileName);
    console.log(res);
    close(client);
    return res;
  }).catch(err => {
    console.log(err);
    close(client);
  });
}

//Return the most recent instance of a given file' lowest score.
function getLow (fileName) {
  let client = null;

  return connect().then(dbObj => {

    const {db} = dbObj;
    client = dbObj.client;

    return db.collection(collName).aggregate([
      { $match:
        { fileName }
      },
      { $sort:
        { timeStamp: 1 }
      },
      { $group:
        { _id: '$fileName',
          lowScore: { $min: '$score' },
          localDate: {$last: '$localDate'},
          localTime: {$last: '$localTime'},
          utcDate: { $last: '$utcDate' },
          utcTime: { $last: '$utcTime' } }
      }
    ]).toArray()

  }).then(res => {
    resChecker(res, fileName);
    console.log(res);
    close(client);
    return res;
  }).catch(err => {
    console.log(err);
  });
}

module.exports = {
  storeScore,
  getAllScores,
  getHigh,
  getLow,
  getAverage,
  connect,
  close
}
