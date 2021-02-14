//Create new instance of Leaflets Controll
var headline = L.control({position: 'topleft'});

//add a onAdd Method that creats a headline Box
//headline is set in form.js
headline.onAdd = function (map) {
    this.container = L.DomUtil.create('div', 'headlineBox');
	this.container.innerHTML = `
		<h2 id="head" class="headline">${FORMELEMENTS.headline}</h2>
		`;
	return this.container;
};