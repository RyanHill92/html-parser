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

  return [start, end];
}

module.exports = getBounds;
