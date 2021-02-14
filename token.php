<?php


//Create a CSRF Token 
function createToken(){	
	// Strat seesion
	session_start();
	// Create random token
	$token =bin2hex(random_bytes(32));
	// Store in session
	$_SESSION['token'] = $token;
	//Return token
	return $token;
}

//Validate CSRF-token
function validateToken($token){ 
	//Get token stored in seesion
	$sessionToken = $_SESSION['token'];
	//return results
	if ($sessionToken==$token){
		return TRUE;
	} else {
		return FALSE;
	}	
}
?>