const currentTime = () => new Date().toString().match(/\d{2}:\d{2}:\d{2}/)[0];

const currentTimeZone = () => new Date().toString().match(/\((.+)\)$/)[1];

const currentDate = () => new Date().toISOString().slice(0, 10);

module.exports = {
  currentTime,
  currentTimeZone,
  currentDate
};
