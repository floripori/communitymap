// text massages shown in instruction guide (hint is dispalyed below step)
const STEPDESCRIPTION ={
	step1: 'Durch einen Klick mit der linken Maustaste an eine beliebige Position in die Karte können Sie eine neue Rückmeldung platzieren.',
	step2: 'Bitte tragen Sie nun Ihre Rückmeldung in das Formular ein und drücken Sie anschließend auf Speichern um Ihre Rückmeldung abzuschicken.',   
	hint1: 'Hinweis: Der Kartenausschnitt kann durch gedrückt halten einer beliebigen Maustaste verschoben werden.',
	hint2: 'Hinweis: Sie können die Position des Markers vor dem Speichern noch verändern. Klicken Sie dazu mit der linken Maustaste auf den Marker und halten Sie diese gedrückt. So können Sie den Marker an die gewünschte Position verschieben. Die bereits eingetragen Informationen bleiben dabei erhalten.'  
};



// create an instance of leaflets controll 
var userDisplay = L.control({position: 'topleft'});

//add a onAdd method that creates a div for instructionGiude an massageBoard
userDisplay.onAdd = function (map) {
    this.container = L.DomUtil.create('div', 'display');
	this.container.innerHTML = `
		<div id="guide" class="instructionGiude"></div></br>
		<div id="msgBoard" class="massageBoard"></div>
		`;
	// call updateStep method to initialze (1=first Step)
	this.updateStep(1);
    return this.container;
};

// add method to update userdisplay
// sets step of instruction guide deafult is "1" call with "2" for second step 
userDisplay.updateStep = function(step=1){
		//create html vor selectet step
		if (step==1){
			var htmlGuide = `
				<h3>Anleitung (Schritt 1):</h3>
				<p>${STEPDESCRIPTION.step1}</p>
				</br>
				<p>${STEPDESCRIPTION.hint1}</p>
			`;
		} else if (step==2) {
			var htmlGuide = `
				<h3>Anleitung (Schritt 2):</h3>
				<p>${STEPDESCRIPTION.step2}</p>
				</br>
				<p>${STEPDESCRIPTION.hint2}</p>
			`;
		} else {
			var htmlGuide = `<h3>Error: Step not Defined!</h3>`;
			
		};
	//post ist on to the instructionGiude 
	$(document).ready(function(){
		$("#guide").html(htmlGuide);
	});
};

//add method to update the massageBoard with massage form server response
//takes the massage and variabel color to change the color of the response 
userDisplay.updateMassageBoard = function (massage,color) {
	//post to massageBoard and change color 
	$(document).ready(function(){
		$("#msgBoard").html(massage);
		$(".massageBoard").css({"color":color});
	});
};

//add method to clear the MassageBoard
userDisplay.clearMassageBoard = function () {
	$(document).ready(function(){
		$("#msgBoard").html("");
	});
};

