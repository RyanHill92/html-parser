const {MongoClient} = require('mongodb');
const {mongoUri, dbName, collName} = require('./mongo-config');
const resChecker = require('./../utils/res-checker');
const {currentTime, currentDate, currentTimeZone} = require('./../utils/current-times');
const util = require('util');

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

function close (client) {
  if (client) {
    client.close();
  }
}

function storeScore (score, fileName) {
  let client = null;

  connect().then(dbObj => {

    const {db} = dbObj;
    client = dbObj.client;

    const run = {
      fileName,
      score,
      date: currentDate(),
      time: currentTime(),
      timeZone: currentTimeZone(),
      timeStamp: Date.now()
    };
    return db.collection(collName).insertOne(run);

  }).then(res => {
      console.log(`Stored run data for '${fileName}.html.' Score: ${res.ops[0].score}`);
      close(client);

  }).catch(err => {
      console.log(err);
      close(client);

  });
}


function getAllScores (start, end) {
  let client = null;

  connect().then(dbObj => {

    const {db} = dbObj;
    client = dbObj.client;

    return db.collection(collName).aggregate([
      { $match:
        { timeStamp:
          { $gte: start || 0, $lte: end || Date.now() }
        }
      },
      { $sort:
        { time: -1 }
      },
      { $group:
        { _id: '$fileName', scores: { $push: { score: '$score', date: '$date', time: '$time' } } }
      }
    ]).toArray()

  }).then(runs => {
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
    close(client);

  }).catch(err => {
    console.log(err);
    close(client);

  });
}


function getHigh (fileName) {
  let client = null;

  connect().then(dbObj => {

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
        { _id: '$fileName', highScore: { $max: '$score' }, date: { $last: '$date' }, time: { $last: '$time' } }
      }
    ]).toArray();

  }).then(res => {
    resChecker(res, fileName);
    console.log(res);
    close(client);

  }).catch(err => {
    console.log(err);
    close(client);
  });
}


function getAverage (fileName) {
  let client = null;

  connect().then(dbObj => {

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

  }).catch(err => {
    console.log(err);
    close(client);
  });
}


function getLow (fileName) {
  let client = null;

  connect().then(dbObj => {

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
        { _id: '$fileName', lowScore: { $min: '$score' }, date: { $last: '$date' }, time: { $last: '$time' } }
      }
    ]).toArray()

  }).then(res => {
    console.log(res);
    close(client);

  }).catch(err => {
    console.log(err);
  });
}

module.exports = {
  storeScore,
  getAllScores,
  getHigh,
  getLow,
  getAverage
}
