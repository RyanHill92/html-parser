//Processes input from --sd and --ed flags.
//Assumes UTC time 00:00:00 for each provided date, if any.
//Passes results to getAllScores (./db/mongo-ops.js) for filtering purposes.
function getBounds(args) {
  //Capture values from command line.
  let start = args.sd || null;
  let end = args.ed || null;


  if (start) {
    start = new Date(`${start}`).getTime();
  }

  if (end) {
    end = new Date(`${end}`).getTime();
  }
  //Each variable returned as either null or a 13-digit timestamp.
  return [start, end];
}

module.exports = getBounds;
