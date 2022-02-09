# WFiIS-TI-Project2
Client (HTML5 with CSS + JavaScript) and server (PHP) application for making offline (IndexedDB) and on-line (MongoDB) surveys.

This project consists of three parts:
1. Client side - everything in [static](static) catalogue. It allows to:
- Fill a survey and send it to a database:
    - if the user is not logged in or does not have an internet connection while sending his answers, the results will be sent into local, browser supplied IndexedDB,
    - if the user is logged in and has an internet connection, he will send his answers into MongoDB database using AJAX call with Fetch;;
- Login / register,
- Show results:
    - IndexedDB results in form of a table,
    - MongoDB results in form of a table when the user is logged in,
    - MongoDB results in form of a pie plots for each question when the user is logged in;
- Logged user can also send his local, IndexedDB answers onto MongoDB database in the results page.
2. Server side - RESTful MongoDB management ([rest](rest), [vendor](vendor) catalogues and [composer.json](composer.json) file). It allows to send queries to database regarding:
- logging in,
- registering,
- logging out,
- creating cookie,
- sending survey results,
- getting survey results.
3. Application building - [manifest.yml](manifest.yml) file. It allows to build this project on IBM Cloud. The only requirement is adding the application name and calling

    ibmcloud app push

command in the system console.

Here is a short showcase of the main application:
![Main page](/showcase/main_page.jpg)

![Log in Page](/showcase/login.jpg)

![Survey](/showcase/survey.jpg)

![Results 1](/showcase/results_1.jpg)

![Results 2](/showcase/results_2.jpg)
