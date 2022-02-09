# WFiIS-TI-Project2
Client (HTML5 with CSS + JavaScript) and server application (PHP) for offline (IndexedDB) and online (MongoDB) surveys.

This project consists of three parts:
1. Client side - everything in a [static](static) directory. It allows to:
- Complete the survey and send it to a database:
    - if the user is not logged in or is not connected to the Internet when sending the response, the results will be sent into the local, browser supported IndexedDB,
    - if the user is logged in and connected to the Internet, he will send the response to the MongoDB database using an AJAX call with Fetch;
- Login / register,
- Show results:
    - IndexedDB results in form of a table,
    - MongoDB results in form of a table when the user is logged in,
    - MongoDB results in form of a pie charts for each question when the user is logged in;
- The logged in user can also submit his local, IndexedDB responses to the MongoDB database on the results page.
2. Server side - RESTful MongoDB management ([rest](rest), [vendor](vendor) directories and [composer.json](composer.json) file). It allows to query the database regarding:
- login,
- registration,
- logging out,
- creating cookies,
- sending survey results,
- getting survey results.
3. Application building - [manifest.yml](manifest.yml) file. It allows to build this project on IBM Cloud. The only requirement is adding the MongoDB access credentials in the MongoDB [configuration and access](rest/mongo.php) file, adding the application name in [manifest.yml](manifest.yml) file and calling

    ibmcloud app push

command in the system console.

Here is a short showcase of the main application (also available [here](showcase)):
![Main page](/showcase/main_page.jpg)

![Log in Page](/showcase/login.jpg)

![Survey](/showcase/survey.jpg)

![Results 1](/showcase/results_1.jpg)

![Results 2](/showcase/results_2.jpg)
