//Main Configuration File

const FORMELEMENTS ={
	//Application Headline
	headline: "Willkommen zur Umfrage:",
	//Define dispayed Headings for Popups (input/stored)
	heading: "Rückmeldeformular:",
	heading2: "Gespeicherte Rückmeldung:",
		
	//Maximum Width of Poup
	popuWidth: 1000,
	
	//Define ID for Survey defined as String but value must be an integer)
	surveyId: "12",  
	
	//Startcoordinate and Zoomlevel 
	startLat: "40",
	startLng: "9.5",
	startZoom: "7",
	
	// Inputs Definition Section 
	// Simply copy element defined between {} and 
	// paste inbetween speparated by "," to add new instance of an Element  
	
	inputs:[
	
		//Radio Eelement
		//typ: musst not be changed
		//name: displayed Text for Input
		//id: Attribute name in Database
        //values: define indivitual values (=individual Button)
		//		  number can be ajusted as needed but may need changes of popuWidth
		
		{	type: "radio",
			name:"Bewertung:",
			id: "Bewertung",
			values:["gut","neutral","schlecht"]
		},

		//Text Eelement
		//As above
		//maxlength and size may be adjusted but may need changes of popuWidth
		
		{
			type:	"text",
			name: "Bemerkung:",
			id:	"Bemerkung",
			maxlength: "40",
			size: "40"
		}
	]
};	