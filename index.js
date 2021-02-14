
// Read CSRF-Token form the Header
function fechToken() {
	//get elements by Class
	var tokenClass = document.getElementsByClassName('csrf-session-token')[0];
	//extract the token 
	return tokenClass.getAttribute('data-token');	
};

// enable figitizing Mode
function enableDigitizing(){
	// add eventlistener to map that calls createMarker on click
	map.on('click',createMarker);
	// change syle of Mouse cursor to "crosshair"
	$(".leaflet-container").css("cursor","crosshair");
};

// disable Digitizing Mode
function disableDigitizing(){
	// remove eventlistener from map that calls createMarker on click
	map.off('click',createMarker);
	// change syle of Mouse cursor to "default"
	$(".leaflet-container").css("cursor","default");
}

// Takes the active editabele marker and changes its properties (dragable) 
function changeMarkerNonEdit(storedData){
	//get activ marker
	var activeMarker = markerLayer.getLayer(eMarkerId);
	//get popup 
	var popup =  activeMarker.getPopup().getContent();
	//create a new popupcontent for stored Data 
	var storedInputDisplay = popupContent.createUserEntryDisplay(storedData);
	//disable dragging 
	activeMarker.dragging.disable();
	//change popupcontenet
	popup.innerHTML = storedInputDisplay;
};

//remove markerfunction
function removeEditMarker(){
	// get acive marker by id
	var activeMarker = markerLayer.getLayer(eMarkerId);
	//remove it form the map 
	map.removeLayer(activeMarker);
}
	

//function to restet application
//clear massage && enable digitizing && display next step to user after timeout (seconds)
function waitResetStart(seconds){
	var milSec = seconds*1000
	setTimeout(function(){
		userDisplay.clearMassageBoard();					
		display.updateStep(1);
		enableDigitizing();
	}, milSec);
}


//callback function to handle response to AJAX-Post Request
function handlePostResponse(response,status,jsonDataStr){
			//check JQuerry status
			if (status == 'success'){
				//convert response to JSON
				var responseJson = JSON.parse(response);
				//convert data send with request to JSON
				var storedData = JSON.parse(jsonDataStr);
				//Check status code in server respone
				if (responseJson.code == "200"){
					//code: 200 is OK 
					//change the marker typ make it a non editable marker
					changeMarkerNonEdit(storedData);
					//display statusmassge to user and color it 
					//green because every thing worked fine
					display.updateMassageBoard(responseJson.msg,"green");
					//clear massage && enable digitizing && display next step to user after timeout (seconds)
					waitResetStart(2)
				} else {
					// all other codes are errors and will be treaded the same 
					//display individual errormassage (comes form backend) (collor: red)
					display.updateMassageBoard(responseJson.msg,"red");
					//remove the marker form map
					removeEditMarker();
				}
					
			} else {
				//status is acutally not set, response is only send as JSON (respone)
				//sust in case display an errormassage anyways
				var massage = "Es ist ein unerwarteter Fehler aufgetretten! Bitte kontaktieren Sie: Webmaster@xyz.de."
				display.updateMassageBoard(massage,"red");
				//remove marker 
				removeEditMarker();
			};
};

// Sends user entry to backend via AJAX-Post Request
function sendUserEntry(){
	//document ready function /not realy needed here but just in case
	$(document).ready(function(){
		//get the userentry as JSON & append the current position
		//& convert to string
		var jsonDataStr = JSON.stringify(appendCurrentPos(popupContent.getUserEntry()));
		//fech the CSRF-Token
		var sessionToken = fechToken();
		//fech the surveyId
		var surveyId = FORMELEMENTS.surveyId;
		//send request to backend via HTTP-POST
		$.post("storeinput.php",{
				data: jsonDataStr,
				token: sessionToken,
				surveyId: surveyId
				},
				function(response,status){
					//function that will process the response
					handlePostResponse(response,status,jsonDataStr);
				}
		);
	});
};	

//reads out current position editableMarker and Appends it to JSON
function appendCurrentPos(usrEntryJson){
	//get activ marker by id 
	var currentMarker = markerLayer.getLayer(eMarkerId);
	//extract position 
	var latLng = currentMarker.getLatLng();
	//add coordinates to JSON
	usrEntryJson["longitude"] = latLng.lng;
	usrEntryJson["latitude"] = latLng.lat;
	return usrEntryJson;
}


		
		
// Create Marker and binde Popup add inputform to it 
function createMarker(event) {
	
	//Create div with class popup
	var popup = L.DomUtil.create('div','popup');
	
	//dynamicaly construkt the popups content
	//function create Form needs name of AJAX function as string
	var content = popupContent.createFrom('sendUserEntry()');
	
	//place the created content insdie the div created in the first step
	popup.innerHTML = content;
	
	//create a dragable marker at the position the user clickt
	var makerDragble = L.marker(event.latlng,{
		draggable: true,
	}).addTo(map);
	
	//bind popup to marker and open popup
	makerDragble.bindPopup(popup,{
		maxWidth : FORMELEMENTS.popuWidth
	}).openPopup();		
	
	//add the created makrer to the editLayer layergroupe
	markerLayer.addLayer(makerDragble);	
	
	//store the unike id of the editable Marker in global variable
	eMarkerId = makerDragble._leaflet_id;
	
	//disable the digitizing mode
	disableDigitizing();
	
	//set the user instruction in the display to next step
	display.updateStep(2);
};



//******run code******************
//All map relatet code is based on leaflet tutorials/documentation on https://leafletjs.com/
// initialize map 
//strat coordinates and zoom come from the form.js
var map = L.map('input_map', {
	center: [FORMELEMENTS.startLat,FORMELEMENTS.startLng],
	zoom: FORMELEMENTS.startZoom
});


// add basemap tilelayer 
//In this case the OSM Tiles where used but this can be changed
//If you are plannig to use the OSM-Tiles 
//make shure to comply with the tile usage policy: https://operations.osmfoundation.org/policies/tiles/
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// initialize layergroup to holde the markers that 
// is needet to later acess markers outside of "createMarker()"
// note that this will never be added to map itsleve only the marker
var markerLayer = L.layerGroup();

// initialize global variable that holdes unike id of editable marker
// this is needed to acces the marker that is currently editabele
var eMarkerId;

//add custom headline  
var head = headline.addTo(map);

// add custum massageBoard on the Left that is used display instruction and massages to the user
var display = userDisplay.addTo(map);

// dissable zoom on doubleclic, beacause i dont like it (leaflets default) 
map.doubleClickZoom.disable();

//enable digitizing mode
enableDigitizing(createMarker);