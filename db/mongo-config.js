const {MongoClient} = require('mongodb');

//All functions in mongo-ops.js depend on these variables.
//Thus, one can switch DBs in an instant without any code to rewrite.
const mongoUri = 'mongodb://RyanHill92:password123456@ds125892.mlab.com:25892/scoring-project';
const dbName = 'scoring-project';
const collName = 'Scores';

// const mongoUri = 'mongodb://localhost:27017';
// const dbName = 'Scoring-Project';
// const collName = 'Scores';

MongoClient.connect(mongoUri, {useNewUrlParser: true}, function(err, client) {
  if (err) {
    console.log('Error connecting to database.');
  }

  const db = client.db(dbName);

  //Schema validation for created collection. 
  db.createCollection(collName, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['fileName', 'score', 'date', 'time', 'timeZone', 'timeStamp'],
        properties: {
          fileName: {
            type: 'string',
            pattern: '[\\w-]+$',
            description: 'must be a string filename without an extension'
          },
          score: {
            type: 'number',
            description: 'must be a positive or negative whole number'
          },
          date: {
            type: 'string',
            pattern: '\\d{4}-\\d{2}-\\d{2}',
            description: 'must be a string in YYYY-MM-DD format'
          },
          time: {
            type: 'string',
            pattern: '\\d{2}:\\d{2}:\\d{2}',
            description: 'must be a string in HH:MM:SS format'
          },
          timeZone: {
            type: 'string',
            description: 'must be a string'
          },
          timeStamp: {
            type: 'number',
            minimum: 1500000000000,
            description: 'should be a timestamp with 13 digits of ms since UNIX epoch'
          }
        }
      }
    }
  })
  .then(() => client.close())
  .catch(e => console.log(e));
});

module.exports = {
  mongoUri,
  dbName,
  collName
};
