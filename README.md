MarkupProject
=============

The Story
----
A new search engine just hit the market, and their alogrithm for ranking search results is based on a score determined by the type and number of HTML tags used on the websites. Your company wants to make sure all of their web pages are going to perform well in this new ranking system, and have asked you to build a tool for the quality-control team that will help them make sure your sites can achieve a high ranking in the new points system.

Your program needs to calculate the score for a given HTML file, and save it to a database as a record for quality-control to use later. In addition to the score, you'll also need to save the name of the author, and the date and time that the score was entered. Files that fall below the minimum score will be sent back to the development team to improve. We will need to be able to see if the quality of the files have improved or declined over time, so your schema must support the ability to score the same file name multiple times and keep a record of each itteration.

They also want to be able to pull data about files quickly, and have asked for the ability to retrive the names of the file with the all-time highest score, all time lowest score, and to see the average score for any file.

In the data folder you'll find the company's existing files, which you can use for testing your application. Your code should be able to score all the provided files, store the score information in a database, and retrieve the lowest, highest, and average scores from your database.


Technical Requirements
-----------------
Create a program in the language of your choice that will read HTML files, calculate scores based on the set of rules provided below, and then save the score for each file. Changes to the content can be re-run over time to determine improvement or regression of the score. Each unique run should be stored with the date and time it was run along with the score received for the file.

You may use external libraries if you feel they will help, but you must place them in the appropriate folder based on the project layout section.

* Score HTML content using the provided scoring guide
* Save results to a SQL database (MySQL, SQL Server, sqlite, SQL Server Express)
* A user should be able to retrieve all scores for a given file
* A user should be able to retrieve all scores run in the system for a custom date range
* A user should be able to retrieve highest score for a given file
* A user should be able to retrieve lowest score for a given file
* A user should be able to retrieve the average score for each unique file name

* Finally, include instructions on how to get your code running. This should include the version of whatever language used, as well as what platform (windows/osx/linux, etc) you are on, and how to install any dependencies that are required to set up your project.  This helps us get running with your code.

**Example of instructions and platform specifications**

>**Languages and tools used:**
>
>- Node v8.4.0
>- NPM v5.3.0
>- MySQL 5.7.17
>- SublimeText3 as my IDE
>- macOS High Sierra
>
>**Instructions**
>
>1. Start a local SQL server instance (I used 'mysql.server start' in the Terminal).
>2. Run SQL commands found in /schema/markup_schema.sql to create the database and tables.
>3. Navigate to the src/ directory
>4. run `npm install` to install all dependencies
>4. run `npm start` to start up the program

## Bonus
* Your program treats tag names as case-insensitive (ie: Html evaluates the same as html)
* Parse multiple sections of the HTML content at the same time for performance
* Handle invalid or poorly formatted HTML. Example:

````
<html>
    <body>
      <p>foo</p> <p>bar</p>
      <div text-align='center'> <big>hello world</big> </div>
    </body>
</html>
````

Scoring Rules
-------------
Each starting tag in the table below has been assigned a score. Any tags not listed in this table will not factor into scoring. Each tag in the content should be added to or subtracted from the total score based on this criteria.

| TagName | Score Modifier | TagName | Score Modifier |
| ------- | :------------: | ------- | -------------- |
| div     | 3              | font    | -1             |
| p       | 1              | center  | -2             |
| h1      | 3              | big     | -2             |
| h2      | 2              | strike  | -1             |
| html    | 5              | tt      | -2             |
| body    | 5              | frameset| -5             |
| header  | 10             | frame   | -5             |
| footer  | 10             |

example:

````
<html>
    <body>
      <p>foo</p>
      <p>bar</p>
      <div text-align='center'>
        <big>hello world</big>
      </div>
    </body>
</html>
````

2 p tags = 2 x 1 <br>
1 body tag = 1 x 5 <br>
1 html tag = 1 x 5 <br>
1 div tag = 1 x 3 <br>
1 big tag = 1 x -2 <br>
**Total Score: 13**


Project Layout
--------------
#### /data

* Contains the HTML content data to parse, format: (filename.html)

ie:
* help.html
* home.html

#### /src

* Your code goes in here.

#### /schema

* Your create table statements for MySQL.

#### /vendor

* Place any external libraries not written by you in the /vendor folder

Instructions
------------
* Begin working on the project and commit your code to this repo.
* When you are finished email your RedVentures recruiter.
* Note that each folder has a blank README.md file.  Feel free to place any notes you may have in these files.
