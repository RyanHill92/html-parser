const {MongoClient} = require('mongodb');

const mongoUri = 'ENTER SAME MONGODB URI HERE AS IN MONGO-CONFIG.JS';
const dbName = 'ENTER SAME DB NAME HERE AS IN MONGO-CONFIG.JS';
//Create a separate test collection.
const collName = 'Scores-Test';

//The code below creates a test DB with schema validation identical to that of project DB.
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

//Export the test collection name to ./mongo-ops.test.js.
module.exports = {
  collName
};
