<?php
//Disable error reporting (can be truned on if not in a production system)
error_reporting(0);

//Maximum number of inputs allowed for IP-Adress and SureveyID
$maxNumInputs=3;

function getDbConnection(){
	//******** This is where to define the parameters for the databaseconnection ****************
	$dbConnectionStr ="port=5432 host=hostname dbname=community_map user=username password=******;
	$dbcon = pg_connect($dbConnectionStr);
	return $dbcon;
}
?>