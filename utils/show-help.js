function showHelp () {
  console.log(`Welcome to Hyper Text Tracker!

To calculate and store scores for .html files in the project root's "data" sub-directory:
"npm run score -- <filename1>, <filename2>, ... " OR "npm run score -- --all"

To retrieve data on all scored .html files:
"npm run all -- <flags>"

To retrieve data for a given .html file:
"npm run get -- <filename> <flags>".

Flags:

--all -- Score all files in the "data" sub-directory (boolean)

--sd -- Start date for custom date range (string)
  ex. '2018-08-01' [Aug. 1, 2018] or '2017' [Jan. 1, 2017]

--ed -- End date for custom date range (string)
  ex. '2018-08-20' [Aug. 20, 2018] or '2018-05' [May 1, 2018]

--avg -- Average score for single file (boolean)

--high -- Highest score for single file (boolean)

--low -- Lowest score for single file (boolean)
`
  );
}

module.exports = showHelp;
