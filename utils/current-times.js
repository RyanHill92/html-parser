//Harvesting of convenient, readable fragments from date strings.
//Used to populate time/date fields for each run object inserted in DB.

const localTime = () => new Date().toString().match(/\d{2}:\d{2}:\d{2}/)[0];

const currentTimeZone = () => new Date().toString().match(/\((.+)\)$/)[1];

const localDate = () => new Date().toString().slice(0, 15);

const utcDate = () => new Date().toISOString().slice(0, 10);

const utcTime = () => new Date().toISOString().split('T')[1].split('.')[0];


module.exports = {
  localTime,
  currentTimeZone,
  localDate,
  utcDate,
  utcTime
};
