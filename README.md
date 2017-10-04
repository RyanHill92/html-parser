MarkupProject
=============

Info
----
Create a program in the language of your choice that will read HTML files, calculate scores based on a set of rules, and then save the score for each file. Changes to the content can be re-run over time to determine improvement or regression of the score. Each unique run should be stored with the date and time it was run along with the score received for the file.

You may use external libraries if you feel they will help, but you must place them in the appropriate folder based on the project layout section.

Requirements
-----------------
* Score HTML content using the scoring guide
* Save results to a SQL database (MySQL, SQL Server, sqlite, SQL Server Express)
* A user should be able to retrieve scores for a given file
* A user should be able to retrieve all scores run in the system for a custom date range
* A user should be able to retrieve highest score for a given file
* A user should be able to retrieve lowest score for a given file
* Additionally you should write one query that will find the average score for all runs **__see project layout below__**
* Finally, include instructions on how to get your code running.  Include the version of whatever language you wrote it in, as well as what platform (windows/osx/linux, etc) you are on.  This helps us get running with your code.

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
>4. run `npm install`
>4. run `npm start`

## Bonus
* Tag names are case-insensitive (ie: Html is the same as html)
* Parse multiple sections of the HTML content at the same time for performance
* Handle invalid HTML

Scoring Rules
-------------
Each starting tag should below has been assigned a score. Each tag in the content should be added to or subtracted from the total score.

(We will assume for this project our html code creator created valid html)

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

* Contains the HTML content data to parse, format: (keyname_yyyy_mm_dd)

ie:
* dougs_2012_02_04.html
* dougs_2012_04_01.html
* dougs_2012_07_01.html

#### /src

* Your code goes in here.

#### /schema

* Your create table statements for MySQL.
* Your query to find the average score across each key. (see data example below)

ie:

| key | avgScore |
|---|--------|
| dougs | 10.35 |
| bobs  | 8.03 |

#### /vendor

* Place any external libraries not written by you in the /vendor folder

Instructions
------------
* Begin working on the project and commit your code to this repo.
* When you are finished email your RedVentures recruiter.
* Note that each folder has a blank README.md file.  Feel free to place any notes you may have in these files.
