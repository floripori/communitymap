<?php
	//require token.php once
	require_once("token.php");
?>

<!DOCTYPE html>
<html>
	<head lang="de">
		<title>
			Community Mapper
		</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<!--embed csrf token-->
		<meta class = "csrf-session-token"  data-token = <?php echo '"'.createToken().'"';?>/>
		<!-- linke Leaflets Stylesheets -->
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" 
		integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
		crossorigin=""></link>
		<!-- link additional Staylesheet for this application rel="stylesheet" type="text/css" href="css/commapmap.css" />-->
		<link rel="stylesheet"  type="text/css" href="commapmap.css"></link>
		<!-- Iclude jQuery -->
		<script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/2.2.3/jquery.min.js"></script>
		<!-- Include Leaflet -->	
		<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
		crossorigin=""></script>
	</head>	
	<body>
		<!--Div for Map-->
		<div id="input_map"> </div>
		<!--Inclue JS Scripts, oder dose Matter!-->
		
		<!--Configuration file for inputform and other configurations-->
		<script type="text/javascript" src="form.js"></script>
		<!--Leaflet-Custom-Control-Box with instructionGiude (step by step) an massageBoard to display massages-->
		<script type="text/javascript" src="display.js"></script>
		<!--Leaflet-Custom-Control Headline Box -->
		<script type="text/javascript" src="headline.js"></script>
		<!--dynamic popupContenet (feedbackform) creation-->
		<script type="text/javascript" src="popup.js"></script>
		<!--main ccript-- all map relatet and AJAX Functions-->
		<script type="text/javascript" src="index.js"></script>
		
		
		

	</body>
</html>