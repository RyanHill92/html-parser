Scoring Project: Ryan Hill
=============

The Application
----

I built a CLI that reads `.html` files straight from the `./data` sub-directory, combs those files for the provided opening tags by iterating through a series of regular expressions, stores unique data for each run in a MongoDB collection, and retrieves various aggregations/ranges of data from said DB. A handful of simple scripts and flags powers all of the above operations, making it convenient for any user, however (un)comfortable with programming, to handle it.

One may, at any time, move new `.html` files into the `./data` sub-directory OR make changes to files already in that directory. The next time one scores all or some of those files, any changes or insertions will be processed by the reading, scoring, and storing functions, thus creating an easily traceable history of unique runs for each file as it evolves or first appears in the folder.

Each data object is stored with several easily readable time/date strings to pinpoint the exact timing of each run and a 13-digit integer timestamp to determine whether that object should be included in a given date range of data.

The Tools
----

I used the following technologies to build my CLI:

1. Node v10.5.0
2. NPM v6.3.0
3. MongoDB:
    - Local Shell/Server: v4.0.0
    - mLab Sandbox Deployment: v3.6.6
4. Atom v1.29.0 as my IDE
5. macOS Sierra v10.12.6

Running the Program
----
1. In the file `./db/mongo-config.js`, set the `MongoUri` variable equal to the URI for EITHER your local instance of MongoDB (`mongo://localhost:27017`) OR a cloud-hosted MongoDB subscription like those mLab offers (`mongodb://<dbuser>:<dbpassword>@ds125892.mlab.com:25892/<dbname>`).

2. In addition to the `MongoUri` variable, assign values to `dbName` (e.g. Scoring-Project) and `collName` (e.g. Scores). (**NB:** If you used a URI from mLab, the name of your database should appear both at the end of that URI and as the value stored by `dbName`.)

3. In the terminal, navigate to the root directory and use `"npm install"` to download the project's (whopping two) dependencies.

4. Use command `"npm run build"` to generate (with schema validation) the collection you named in step 2.

5. Use command `"npm start"` to view instructions in the terminal for scoring files and storing/retrieving data.

6. Optional: Use `"npm install mocha expect"` then `"npm test"` to run the test cases in `./utils/tests`.
