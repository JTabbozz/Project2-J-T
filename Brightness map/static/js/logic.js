// MAPS needed for our diverse backgrounds - tile layers:

// OUTDOORS TYPE MAP
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
  accessToken: API_KEY
});

// GRAYMAP TYPE
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
  accessToken: API_KEY
});

//  SATELLITE TYPE MAP
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
  accessToken: API_KEY
});

var southWest = L.latLng(-12.09, +128.71),
    northEast = L.latLng(-35.09, +100.71),
    bounds = L.latLngBounds(southWest, northEast);

// Define a map object with center, zoom and layers
var map = L.map("mapid", {
  // Western Australia center location
  center: [-30.09, +115.71],
  zoom: 6,
  maxBounds: bounds,   
  maxZoom: 25,
  minZoom: 6,
  layers: [outdoors, graymap, satellitemap]
});


// Define variables needed for layers.
var Bush_Fire_Prone_Areas = new L.LayerGroup();
var Bushfires= new L.LayerGroup()

// Layers containing different map options
var baseMaps = {
  "Satellite map": satellitemap,
  "Grayscale map": graymap,
  "Normal physical map": outdoors
};

// overlays for data of 
var overlayMaps = {
  "Bushfires": Bushfires,
  "Bush Fire Prone Areas": Bush_Fire_Prone_Areas,
};

var geoData = "https://australia-fire-api-dashboard.herokuapp.com/api/v1.0/fires_modis_geojson";
//var geoData_Flask_API = "http://127.0.0.1:5000/api/v1.0/firedata"
var geojson;

// Adding control layers to map.
L.control
  .layers(baseMaps, overlayMaps, {collapsed: false})
  .addTo(map);

// Extract fires geoJSON data.
// decided to retrieve all fires data for last week among different options
  d3.json(geoData, function(data) {
    // console.log(data.features);

  // function to give outlook for markers
  function styleInfo(feature) {
    return {
      fillOpacity: 0.8,
      // Color will be determined by "depth" or 3rd data in coordinates so #2 index as requested
      fillColor: getColor(feature.properties.brightness),
      // border of markers/bubbles
      color: "black",
      // Radius will be determined by richter scale magnitude of fires
      radius: getRadius(feature.properties.epr),
      stroke: true,
      weight: 0.5
    };
  }

  // Color of the marker depending on brightness of the fire.
  function getColor(brightness) {
    switch (true) {
      case brightness > 450:
        return "#f88e86";
      case brightness > 400:
        return "#f77b72";
      case brightness > 350:
        return "#f6685e";
      case brightness > 300:
        return "#f5554a";
      case brightness > 250:
        return "#f44336";

      default:
        return "#ffd700";
    }
  }

  // Establish final radius of the fires marker 
  // based on its magnitude adjusted or weighted to have better visibility
  function getRadius(brightness) {
    return brightness * 3;
  }

  // add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      // Popup text
      layer.bindPopup("<strong> Brightness temperature 21 (Kelvin): </strong>" + feature.properties.brightness
      + "<br><strong>Fire radiative power (FRP) in MW: </strong>" + feature.properties.frp) 
    }

  }).addTo(Bushfires);

  Bushfires.addTo(map);

  // Position of legend in the map
  var legend = L.control({
    position: "bottomleft"
  });


// Adding legend colors, title, etc
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  //title of labels box, bold and give one additional row space
  labels = ['<strong>Bush Fire brightness temperature <br> (Kelvin) as recorded by (MODIS) satellite<br></strong> <strong/>M</strong>oderate <strong/>R</strong>esolution <strong/>I</strong>maging <strong/>S</strong>pectroradiometer<br>'];

  var Brigh = [150, 250, 300, 350, 400, 450];
  var colors = [
    "#f88e86",
    "#f77b72",
    "#f6685e",
    "#f5554a",
    "#f44336",
    "#ffd700"
  ];
  // Send label to box title
  labels.push('<title></title>');
  div.innerHTML = labels.join('<br>');

 // Loop and to build legend, add classes and div to send to html and map
  for (var i = 0; i < Brigh.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
    Brigh[i] + (Brigh[i + 1] ? " to " + Brigh[i + 1] + " Kelvin<br>" : "+ Kelvin");
  }
  return div;
};
legend.addTo(map);

// Use this link to get the geojson data.
 var link_P_t_F = "../Brightness map/static/data/Bush_Fire_Prone_Areas_designated_21052016_OBRM_005_WA_GDA2020_Public.geojson";
  
 d3.json(link_P_t_F,
   function(P_t_F_data1) {
     //console.log(platedata1.features);
     // Add tectonic plates lines to map
   L.geoJson(P_t_F_data1, {
     color: "orange",
     fillColor: "orange",
     fillOpacity: 0.2,
     weight: 1.5
   })
   .addTo(Bush_Fire_Prone_Areas);
     // add the Fire prone area layer to the map.
    Bush_Fire_Prone_Areas.addTo(map);
   });
  
});
