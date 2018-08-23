const {MongoClient} = require('mongodb');

//All functions in mongo-ops.js and mongo-ops.test.js depend on these variables.
const mongoUri = 'ENTER MONGODB URI HERE';
const dbName = 'ENTER DB NAME HERE';
let collName = 'Scores';

//Ensures all function calls in mongo-ops.test.js point to test DB.
if (process.env.NODE_ENV === 'test') {
  collName = 'Test';
}

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
        required: ['fileName', 'score', 'utcDate', 'utcTime', 'localDate', 'localTime', 'timeZone', 'timeStamp'],
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
          utcDate: {
            type: 'string',
            pattern: '\\d{4}-\\d{2}-\\d{2}',
            description: 'relevant date (YYYY-MM-DD) for custom date range data retrieval'
          },
          utcTime: {
            type: 'string',
            pattern: '\\d{2}:\\d{2}:\\d{2}',
            description: 'relevant time for custom date range data retrieval'
          },
          localDate: {
            type: 'string',
            pattern: '\\w{3}\\s\\w{3}\\s\\d{2}\\s\\d{4}',
            description: 'local date in format ddd MMM DD YYYY'
          },
          localTime: {
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
