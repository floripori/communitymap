<?php
//disable error reporting for production system. 
//It may be better to configure the php.ini, to log errors while not displaying.
error_reporting(0);
//set header to utf-8
header('Content-Type: text/html; charset=utf-8');
//start Session
session_start();


//---include php Files
//token validation/creation
require_once("token.php");
//load configuration and database connectionstring
require("config.php");


//Escape string with htmlspecialchars prevente Cross-Site-Scripting (XSS)
function escapeString($string){
	// option "ENT_QUETES" is set to remove all typs of quotes (double:" single:') wich is not done by default. 
	return htmlspecialchars($string,ENT_QUOTES,"UTF-8");
}

//Escape all values (and keys) of associative array 
function escapeUserInput($userInput){	
	//perpare array for escaped output
	$escapedArray = array();
	//loop throug all key value pairs and escape keys and values
	foreach ($userInput as $key => $value){
		$ekey = escapeString($key);
		$evalue = escapeString($value);
		$escapedArray[$ekey] = $evalue;
	}
	//return escaped array
	return $escapedArray;
}


//Querry database for number of records stored undere users IP-Address with respect to the actual surveyId
function fechNumRecordsForIp($dbcon,$userIp,$surveyId){
	//get number of records allready stored  
	$query = "SELECT count(ip) AS ipcount FROM com.commap WHERE ip ='".$userIp."' AND surveyid = ".$surveyId.";";
	$result = pg_query($dbcon,$query);
	//extract numberOfRecords stored for IP in 
	$numOfIpRecords = pg_fetch_result($result,0,'ipcount');
	//retrun it
	return $numOfIpRecords;
}


//Funktion sends request response (Status and Errormassages) to client as JSON (sting)
function sendPostResponse($code,$massage){
	//Stores an errorcode and a custom massage to display to user
	$responseJson = array("code"=>$code,"msg"=>$massage);
	//convert Array to JSON (as string)
	$responseJsonStr = json_encode($responseJson,JSON_UNESCAPED_UNICODE);
	//send to client
	echo $responseJsonStr;
}

//Convert JSON formatet string to hstro-style formatet string
function convertJsonToHstore($json){
	//replace ":" with " => " 
	$hstore= str_replace(":"," => ",$json);
	//replace curly brackets "{""}"
	$hstore = str_replace("}","",str_replace("{","",$hstore));
	return $hstore;
} 

// MAIN: process Request
// Check if requered POST variables are set
if (isset($_POST["data"])&&isset($_POST["token"])&&isset($_POST["surveyId"])){
		//Read csrf-token
		$token= $_POST["token"];
		//Get database connection (will be checked below)
		$dbcon = getDbConnection();
		
		//Check if received token is valid to protect against CSRF-attacks
		if (!validateToken($token)){
			
			//Token ist not valid, send error code to "401"(:Unauthorized) and custom massage
			$msg = "Die Session ist abgelaufen oder ungültig. Bitte laden Sie die Webseite erneut";
			sendPostResponse("401",$msg);
			
		// token ok - check db connection
		} else if (!$dbcon){
				
				//Database connection has faild, report code "500: Internal Serever Error" and custom massage 
				$msg = "Es ist ein unerwarteter Fehler aufgetreten! Bitte kontaktieren Sie: Webmaster@xyz.de.";
				sendPostResponse("500",$msg);

		} else {
			
			//Get clients IP-Address
			$userIp = strval($_SERVER['REMOTE_ADDR']);
			//Read the currend surveyId and escape the string 
			$surveyId = escapeString($_POST["surveyId"]);
			//Get number of records in DB for current IP-Address (where sureveyId equals current sureveyId)
			$numOfIpRecords = fechNumRecordsForIp($dbcon,$userIp,$surveyId);
			
			//Check if max. number of records in DB for IP-Address is not exceeded (considering only actual surveyId)
			if ($numOfIpRecords>=$maxNumInputs){
				
				//Number of records exceeded, send code to "429"(:Too Many Requests) and custom massage
				$msg = "Die Daten konnten nicht gespeichert werden. Es sind maximal ".$maxNumInputs." Rückmeldungen pro Nutzer zulässig.";
				sendPostResponse("419",$msg);
			
			
			//Max number of records is not exceeded now Process the Request
			} else {
				
				//________Read Data Retreieved via POST______
				//Read input data entered by User as JSON-String
				$userInput = $_POST["data"];
				
				//-----------------Prepare Data for Database------------------------
				//Decode JSON data: string > Array 
				$userInput = json_decode($userInput, true);
				
				// Create point geometry string form longitude, latitude (not directly entered by user, not escaped)
				$point = 'POINT('.strval($userInput['longitude']).' '.strval($userInput['latitude']).')';
				
				//create subset of userInput (Array)- result contains only key-value-pairs that will be stored inside hstore datatype
				//otipon $preserve_keys is set to true because we needed the keys
				$attrib = array_slice($userInput, 0, -2, true); 
				
				// Escape userinput form charakters that could be used in XSS-Attacks
				// this ist applied values and keys too (just in case)
				$attribEsc = escapeUserInput($attrib);
				
				// Now encode associative array as json-(string) again
				// Option "JSON_UNESCAPED_UNICODE" is used to keep german umlauts
				$attribJson = json_encode($attribEsc,JSON_UNESCAPED_UNICODE);

				// Convert to fromat needed for hstore-datatype 
				$attribHstore = convertJsonToHstore($attribJson);
				
				//-------Prepare Querry and store in Database-------------
				
				//Prepare parameterised Querry (INSERT) to prevent sql injection
				$dbinsert = "INSERT INTO com.commap(ip,surveyid,attributes,geom) VALUES ($1,$2,$3,ST_PointFromText($4, 4326));";
				
				//Compile preapred sql querry on server 
				$result1 =  pg_prepare($dbcon,"insertData",$dbinsert);
					//the line below may be usfull during setup of the application
					//or die('Somthing whent wrong: ' . pg_last_error());
				
				//exectute prepared querry 
				$result2 = pg_execute($dbcon, "insertData", array($userIp,$surveyId,$attribHstore,$point));
					//the line below may be usfull during setup of the application
					//or die('Somthing whent wrong: ' . pg_last_error());
				
				
				//------------Check if Data was stored successfully and create response--------------- 
				// Check if data could be saved
				if ($result1&&$result2){
					//Results are ok, report code "200: OK" and custom massage 
					$msg = "Ihre Rückmeldung wurde gespeichert, Vielen Dank!";
					sendPostResponse("200",$msg);
				} else {
					//Insert has faild, report code "500: Internal Serever Error" and custom massage 
					
					$msg = "Es ist ein unerwarteter Fehler aufgetreten! Bitte kontaktieren Sie: Webmaster@xyz.de.";
					sendPostResponse("500",$msg);
				}
				
				//Free results
				pg_free_result($result1);
				pg_free_result($result2);
				//Close connection anyways 
				pg_close($dbcon);
				}
			}				
} else {
	//Requierd data has not been recieved. Report code "400: Bad Request" and custom massage 
	$msg = "Es ist ein unerwarteter Fehler aufgetreten! Bitte kontaktieren Sie: Webmaster@xyz.de.";
	sendPostResponse("500",$msg);
};


?>