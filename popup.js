//namespace for creation of popupcontent (dynamic feedbackform) 
var popupContent = {
	
	//check Inputs - input-elements are checkt for userentry 
	checkInputs: function(){
		var fieldStatus = false;
		//iterate throug user defined inputs an check if set/ not empty
		FORMELEMENTS.inputs.forEach(function(input){
			// Case 1 textinput: trim will result in empty string if only withspace was enterd  
			if (input.type == "text") { 
				if ($('#'+input.id).val().trim() != ""){
					fieldStatus = true;
				}
			// Case 2 radiobutton: true when checked 
			} else if (input.type == "radio"){
				if ($('input[name='+input.id+']:checked').val()){
					fieldStatus = true;
				}
			}
		});
		return fieldStatus;
	},
	
	// listener function for input-element that enables / disables button depending on user entry 
	swichButton: function (){
		var state = document.getElementById('save').disabled;
		var fieldStatus = this.checkInputs();
		//enable if button (state) disabled = true an fieldStatus is true (not empty) and vice versa
		if (state&&fieldStatus){
			document.getElementById('save').disabled = false;
		} else if (!state&&!fieldStatus) {
			document.getElementById('save').disabled = true;
		}
	},
	
	// read the user entry from inputs and retrun AS JSON
	getUserEntry: function(){
		var usrEntryJson ={}
		// iterate throug inputs
		FORMELEMENTS.inputs.map(function(formElement){
			if (formElement.type == "radio"){
				//get value of element 
				var value = $('input[name='+formElement.id+']:checked').val();
				//in case radiobutton is unset replace undefined with ""
				if (typeof value == "undefined"){
					value = "";
				}
				//add to JSON use id as Key 
				usrEntryJson[`${formElement.id}`] = value;
			} else if (formElement.type == "text"){
				//get value of element 
				var value = $('#'+formElement.id).val();
				//add to JSON use id as Key
				usrEntryJson[`${formElement.id}`] = value;
			}
		});
		return usrEntryJson;
	},
	
	
	//Construct  a text-input (and add listners funtion: swichButton()(enables Button after valid input)
	creatInputText: function(fromElement) {
		if (fromElement.type == "text"){
			return `
				<tr><td>${fromElement.name}: </td></tr>
				<tr>
					<td> 
						<input type="text" id="${fromElement.id}" name="${fromElement.name}" 
							onkeyup="popupContent.swichButton()" onchange="popupContent.swichButton()" maxlength="${fromElement.maxlength}" 
							size="${fromElement.size}">
						</input>
					</td>
				</tr>
				<tr></tr>
				`;
		}
	},


	//Construct radiobutton-input (and add listners funtion: swichButton()(enables Button after valid input)
	createRadioInput: function(fromElement) {
		// Construct one radio-input with label
		function createRadioElement(radioElement) {
			return `
				<input type="radio" id="${radioElement}" name="${fromElement.id}" value="${radioElement}" 
				onchange="popupContent.swichButton()"></input>
				<label for="${radioElement}">${radioElement}</label>`
			}
		
		// check if actual input is of type "radio" if so construct a radiobutton
		// a radiobutton consiting of several radioelements (correspondig to the values) 
		// map calls createRadioElement() for each individual value defined for the radiobutton
		// text displayed above ist taken from "fromElement.name"
		if (fromElement.type == "radio"){
			return `
				<div>${fromElement.name}:</div>
				<div>
					${fromElement.values.map(createRadioElement).join('')}
				</div>
				<br>
			`;
		}
	},


	//Create the popupcontenten (feedbackform) for editabele marker
	//the name of listnerfuntion that sends AJAX request will be requierd as input (defined in index.js)
	//this will be added to the "save" button
	//map calls createRadioInput,creatInputText for every inputelement in the array inputs defined in "form.js"
	//and joins the result without seperator
	//called functions will check typ of input and only retrun content if typ maches 
	createFrom: function(listenerName){
		return `
			<h3 class=popupHeading>${FORMELEMENTS.heading}</h3>
			<br>
			${FORMELEMENTS.inputs.map(this.createRadioInput).join('')}
			<table>
				<tr></tr>
				${FORMELEMENTS.inputs.map(this.creatInputText).join('')}
				<tr></tr>
				<tr><td><button id="save" onclick=${listenerName} disabled>Speichern</button></td>			
			</table>
			`;
	},

	//Create popupcontenten for stored markers - requiers stored Data as input (same data that has been send to backend) 
	createUserEntryDisplay: function(storedData){
		var kayValueList =`<h3 class=popupHeading>${FORMELEMENTS.heading2}</h3>
			<table>`
		//iterate throug object and create html vor key/value-pairs except latitude, longitude
		for (var key in storedData){
			if (key!="longitude"&&key!="latitude"){
				kayValueList = kayValueList+ `<tr><td>${key}:</td><td>" ${storedData[key]} "</td></tr>`;
			}
		}
		//join heading and dynamically createt table 
		kayValueList = kayValueList +`</table>`;
		return kayValueList
	}
}

















