/*************************
 * SETUP MAL TILE LAYERS *
 *************************/

//URL from map tile servers
osm_source = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

//Attribution of map providers 
osm_attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> CC-BY-SA &vert; Crafted with &hearts; by <a href="https://github.com/sirknival" > Sirknival</a>';

//Init map tile layers
var osm = L.tileLayer(osm_source, { maxZoom: 17, attribution: osm_attrib });

//Combine map tile layer ins one dict
var baseLayers = {
	"OpenStreetMap": osm,
};

/***************
 * SETUP ICONS *
 ***************/

//Create Template Icon Class
var tmpl_icon = L.Icon.extend({
	options: {
		iconUrl: "foo.png",
		iconSize: [33, 47],
		iconAnchor: [16, 47],
		popupAnchor: [0, -50],
		draggable: false,
		riseOnHover: true
	}
});

//Init three instances of class template icon 
var icon_localgroup = new tmpl_icon({ 'iconUrl': 'icons/local_group_icon.png' }),
	icon_heaquarter = new tmpl_icon({ 'iconUrl': 'icons/headquarter_icon.png' });


//Init icon layer groups
var local_group = new L.LayerGroup(),
	headquarter = new L.LayerGroup();
	
/*****************
 * SETUP MARKERS *
 *****************/
var cathegory_types = [ "headquarter","group" ]
var layer_list = [headquarter, local_group];
var icon_list = [ icon_localgroup,icon_heaquarter];


function selectBasedOnCathegory(feature, list){
	return list[cathegory_types.indexOf(feature.properties.category)];
}

function onEachFeature(feature, layer) {
	layer.bindPopup(feature.properties.name);
	layer.on('mouseover', function (e) { this.openPopup(); });
	layer.on('click', highlightFeature);

	layer.on('dblclick', resetHighlight);
	layer.on('mouseout', function (e) { this.closePopup(); });
	
	layer.addTo(selectBasedOnCathegory(feature, layer_list));
}


L.geoJSON(geojsonFeature, {
	pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: selectBasedOnCathegory(feature, icon_list)});
	},
	onEachFeature: onEachFeature
});


//Create dicts for control box
var overlays = {
	"Pfadigruppen in Wien: ": local_group,
	"Landesverband": headquarter
};

/**************************************
 * SETUP MAP AND MAP CONTROL ELEMENTS *
 **************************************/
//Home point of view

var home = {
	lat: 48.208670,
	lng: 16.372684,
	zoom: 11
};


//Init map
var campsides_map = L.map('map', {
	center: [home.lat, home.lng],
	zoom: home.zoom,
	minZoom:12,
	attributionControl: true,
	zoomControl: false,
	measureControl: false,
	dragging: true,
	layers: [osm, local_group, headquarter]
});

//Add layers to map 
L.control.layers(baseLayers, overlays, {
	collapsed: true,
	position: 'topright'
}).addTo(campsides_map);

//Add special marker layers to map
geoJSONLayer = L.geoJSON().addTo(campsides_map);


//Create and add zoom controls 
L.control.zoom({
	position: 'topright'
}).addTo(campsides_map);

//Create and add scale controls
L.control.scale({
	metric: true,
	imperial: false,
}).addTo(campsides_map);


//Add home button
L.easyButton('fas fa-home', function (btn, map) {
	map.setView(new L.LatLng(home.lat, home.lng), home.zoom,);
}, {
	position: 'topright'
}).addTo(campsides_map);

//Add infobox about campsides
var info = L.control({
	position: 'topleft'
});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML =  (props ? '<h4 >' + props.name +(props.content.subname==""? "":  " - " +props.content.subname) + '</h4><p>' + formatContent(props.content)  : '<h4>Infos zu der Pfadigruppe</h4><p>Wähle eine Gruppe aus</p>');
};

function formatContent(c) {
	var content = "<b class='name'> Adresse:</b><ul><li>";
	content += c.address.street + "</li><li>";
	content += c.address.postal_code + " Wien</li></ul>";
	console.log(content);

	content += "<b class='name'>Kontaktm&ouml;glichkeiten:</b><ul><li>";
	content += "<a target='_blank' href=https://"+ c.contact.web + ">" + c.contact.web + "</a></li><li>";
	content += "<a href=mailto:"+ c.contact.mail + ">" +c.contact.mail +"</a></li><li>";
	content += c.contact.phone +  "</li></ul>";
	console.log(c.age_groups.length);
	if (c.age_groups.length > 0){
		content += "Angebotene <b class='name'> Altersstufen</b><ul>";
		for (elem in c.age_groups){
			content += "<li>" + c.age_groups[elem] + "</li>";
		}
		content += "</ul>";
		content += "Hier erf&auml;hrst du, welche <a target='_blank' href='https://ppoe.at/ueber-uns/'>Altersstufe</a> die richtige für dich ist"
	}
	
	content += '</p><p>';
	
	return content;
}

info.addTo(campsides_map);


//Add 19er Branding to Map
var branding = L.control({
	position: 'bottomright'
});

branding.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'logo'); // create a div with a class "info"
    div.innerHTML = '<img src="logo_wpp.png"  width="150"> ';
	return div;
};

branding.addTo(campsides_map);


/**************************************
 * SETUP MAP AND MAP CONTROL ELEMENTS *
 **************************************/
function highlightFeature(e) {
    info.update(e.target.feature.properties);
	e.target.bringToFront();
}

function resetHighlight(e) {
    info.update();
}