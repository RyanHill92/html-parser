const expect = require('expect');
const {storeScore, getAllScores, getHigh, getLow, getAverage, connect, close} = require('./../mongo-ops');
const {collName} = require('./../mongo-config');

const runs = [
  {
    fileName: 'sample-one',
    score: 10,
    date: '2018-08-15',
    time: '00:00:00',
    timeZone: 'Eastern Daylight Time',
    timeStamp: new Date('2018-08-15').getTime()
  },
  {
    fileName: 'sample-one',
    score: 20,
    date: '2018-08-20',
    time: '00:00:00',
    timeZone: 'Eastern Daylight Time',
    timeStamp: new Date('2018-08-20').getTime()
  },
  {
    fileName: 'sample-two',
    score: 10,
    date: '2018-08-10',
    time: '00:00:00',
    timeZone: 'Eastern Daylight Time',
    timeStamp: new Date('2018-08-10').getTime()
  },
  {
    fileName: 'sample-two',
    score: 10,
    date: '2018-08-22',
    time: '00:00:00',
    timeZone: 'Eastern Daylight Time',
    timeStamp: new Date('2018-08-22').getTime()
  }
];

//Before each test case, populate test DB with sample runs.
function refresh (done) {
  let client = null;
  connect().then(dbObj => {
    const {db} = dbObj;
    client = dbObj.client;

    return db.collection(collName).deleteMany({}).then(() => {
      return db.collection(collName).insertMany(runs);
    });
  }).then(() => {
    close(client);
    done();
  }).catch(e => done(e));
}

beforeEach(refresh);

describe('storeScore', () => {
  it('should store a new score to the database', (done) => {
    let client = null;
    storeScore(0, 'sample-one').then(() => {

      return connect();

    }).then(dbObj => {
      const {db} = dbObj;
      client = dbObj.client;

      return db.collection(collName).find({}).toArray();

    }).then(runs => {
        close(client);
        expect(runs.length).toBe(5);
        expect(runs[4].score).toBe(0);
        expect(runs[4]._id).toBeTruthy();
        done();
    }).catch(e => done(e));
  });
});

describe('getAllScores', () => {
  it('should return an array of aggregated objects, grouped by fileName', (done) => {
    getAllScores().then(runs => {
      expect(runs).toHaveLength(2);
      expect(runs[0].scores.length).toEqual(runs[1].scores.length);
      done();
    }).catch(e => done(e));
  });

  it('should filter returned data appropriately when passed a date range', (done) => {
    getAllScores(new Date('2018-08-15').getTime(), new Date('2018-08-20').getTime()).then(runs => {
      expect(runs).toHaveLength(1);
      expect(runs[0]).toMatchObject({_id: 'sample-one'});
      expect(runs[0].scores).toHaveLength(2);
      done();
    }).catch(e => done(e));
  });
});

describe('getHigh', () => {
  it('should return a single object (in an array) with file\'s most recent instance of high score', (done) => {
    getHigh('sample-two').then(res => {
      expect(res[0]).toHaveProperty('highScore', 10);
      expect(res[0].date).toBe('2018-08-22');
      done();
    }).catch(e => done(e));
  });
});

describe('getLow', () => {
  it('should return a single object (in an array) with file\'s most recent instance of low score', (done) => {
    getLow('sample-two').then(res => {
      expect(res[0]).toHaveProperty('lowScore', 10);
      expect(res[0].date).toBe('2018-08-22');
      done();
    }).catch(e => done(e));
  });
});

describe('getAverage', () => {
  it('should return a single object (in an array) with file\'s average score, nothing more', (done) => {
    getAverage('sample-one').then(res => {
      expect(res[0]).toHaveProperty('averageScore', 15);
      done();
    }).catch(e => done(e));
  });
});
