# communitymap
#####Readme:  CommunityMap – by Florian Lauer #######

Description:
This is project is an implementation of a prototype of a simple map-based feedback- and participation tool. 
The tool is designed for data collection in participatory mapping (community mapping), such as public involvements. 
It is based on the Leaflet open-source JavaScript library for interactive maps (https://leafletjs.com/).  
Users are enabled to place a marker on top of an interactive map and to attach a statement or evaluation to it. 
This user feedbacks are inserted into a database. The prototype can be customized for different application purposes,
depending on the topic of a particular participatory mapping study. Notably, the input form for the user feedback was 
designed extendable and its content may be adapted to different survey requirements. Some application security gaps like
SQL-injection have been considered, however there may be still security issues left to be solved!
The tool is still a prototype and not fully featured application for the use in a productions system. 
For example, it lags features like a user administration.


Overview over Files:

commapmap.css : Style sheet of the application

config.php: Configuration file backend (see below for details)

createDatabase.php: Script to create the application database

display.js: Contains code for box to display user instructions / messages (leaflet-custom control) 

form.js: Configuration file frontend (see below for details)

headline.js: Code for custom headline-box

index.js: Main JavaScript file, contains map related code and AJAX

index.php: The actual website containing the HTML and loading des JS-code. PHP extension is
      needed to place the csrf-token in the <head> of the page

popup.js: Contains all code for dynamic creation of the feedback form (the popup content)

storeinput.php: Processes the client request, checks csrf-token, number of stored inputs for a user and stores the data (user feedback)

token.php: Contains functions to create and validate a csrf-token

System requirements:

	1.	A HTTP-Server (e.g., Apache) with PHP 7.4.3 
	2.	PostgreSQL Database (Version 12.4)
		with following extensions:  
			a.	PostGIS (Version 3.0.2)
			b.	hstore

Previous versions of the different components may work as well, but without warranty.

Installation:
1.	All files in this folder need to be placed in the http-folder e.g. “htdocs” of the webserver.
	Some files e.g. JS and CSS may be moved to subdirectories (depending on the settings of the webserver)
	but this will require adaptions in the code!
	
2.	The file “createDatabase.php” needs to run once (loaded in a web browser) to create the database, 
	tables and extensions needed by the application. Before that connection parameters for the database
	must set inside the file. The user specified must have the required privilege to perform these database transactions. 
	Afterwards the file should be removed from the http-folder. It’s no longer needed.
	
3.	Now the database connection parameters for running the application must be defined in the “config.php” file. 
	It is recommended to use a less privileged www-user in a production system (should be allowed to INSERT data and, SELECT data).
	
4.	Now everything should be ready.  Open “index.php” in a web browser e.g.  “http://localhost/CommunityMap/index.php”

Configuration:

1.	The maximum number of feedbacks a user can store, can be changed in “config.php” as well “$maxNumInputs”.

2.	Configuration of the frontend is done in “form.js”. In the JSON-object different settings 
	(e.g. the start coordinates and as “surveyId”) may be changed, also input elements,
	as radiobuttons and text input may be adapted and new instance of this elements can be added. 
	More details are found inside the "form.js".
	
3.	The text displayed in the step-by-step instruction may be changed in the top section of “display.js” 
