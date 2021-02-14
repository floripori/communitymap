<?php
//*******Only run once to Create the Database - than remove form web folder (htdocs) ****** 

//Define database connection "port=".$port." host=".$host." user=".$user." dbname=".$dbname." password=".$password
//DBuser needs permisson to Create a Database 
//If $dbname is changed you need to also change the name in the config.php
$port="5432";
$host="localhost";
$user="";
$dbname="community_map";
$password="";
$conPg="port=".$port." host=".$host." user=".$user."  password=".$password;
$conDb= $conPg." dbname=".$dbname;

// CREATE DATABASE IF NOT EXSITS is not supported by postgreSQL
// thus we try to connect to the Database we want to create and only
// proceed if it does not exist 
if (!@pg_connect($conDb)){
	
	// Connect to DB Server
	$pgcon = pg_connect($conPg)
		or die('An error has occurred: ' . pg_last_error());
	
	//Create New Database 
	$createDbq ="CREATE DATABASE ".$dbname.";";
	pg_query($pgcon,$createDbq)
		or die(pg_last_error());
	
	//Close connection	
	pg_close($pgcon);
	
	//Connect to the database just created 
	$dbcon = pg_connect($conDb)
		or die('An error has occurred: ' . pg_last_error());

	//Create extensions	
	$createTbq ="CREATE EXTENSION postgis;";
	$createTbq.="CREATE EXTENSION hstore;";
	//Create a new Schema, because we do not whant to use the puplic Schema 
	$createTbq.="CREATE SCHEMA com;";
	//Create DB Table
	$createTbq.="CREATE TABLE com.commap(id serial PRIMARY KEY,ip VARCHAR(39),surveyid int,attributes hstore,datetime timestamptz NOT NULL DEFAULT now());";
	//Add a Geometry Column 
	$createTbq.="SELECT AddGeometryColumn('com','commap','geom',4326,'POINT',2)";
	//Run Querry 
	pg_query($dbcon,$createTbq)
		or die(pg_last_error());
	
	//Close connetcion
	pg_close($dbcon);
	echo "Database and Table successfully created";
		
} else{
	//The Database allready exists do nothing 
	echo"The Database \"".$dbname."\" allready exists";
};

?>