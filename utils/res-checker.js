function resChecker (arrayResponse, fileName) {
  if (arrayResponse.length === 0) {
    throw new Error(`Unable to retrieve data for ${fileName}.html.
Please ensure file name is valid.`);
  }
  return;
}

module.exports = resChecker;
