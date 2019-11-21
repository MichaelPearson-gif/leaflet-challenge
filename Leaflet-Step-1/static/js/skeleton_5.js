// Load the geojson earthquake data for the past week
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a function for the marker size
function markerSize(magnitude) {
    // Initial scaling of each marker so it is 10 times the size of each earthquake's magnitude
    return magnitude * 10;
}

// Create a function to determine each marker color
function markerColor(magnitude) {

    // Use conditionals to determine which color
    if (magnitude > 5) {
        return "maroon";
    }
    else if (magnitude > 4) {
        return "red";
    }
    else if (magnitude > 3) {
        return "orange";
    }
    else if (magnitude > 2) {
        return "yellow";
    }
    else if (magnitude > 1) {
        return "green";
    }
    else {
        return "lime";
    }

}

// Perform a request of the data
d3.json(geoData, function(data) {

    // Once the response is recieved, send it to the createFeatures function
    createFeatures(data.features);
});

// Create the createFeatures function
function createFeatures(earthquakeData) {

    // Initialize arrays to hold the different markers
    // levels correspond to magnitudes from low to high
    var level1Markers = [];
    var level2Markers = [];
    var level3Markers = [];
    var level4Markers = [];
    var level5Markers = [];
    var level6Markers = [];

    // Printing the array to the console to see how it comes out
    console.log(level1Markers);

    // Create the separate layer groups
    var LOW = L.layerGroup(level1Markers);
    var LOW_MEDIUM = L.layerGroup(level2Markers);
    var MEDIUM = L.layerGroup(level3Markers);
    var MEDIUM_HIGH = L.layerGroup(level4Markers);
    var HIGH = L.layerGroup(level5Markers);
    var EXTREME = L.layerGroup(level6Markers);

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature) {

        // Append the marker arrays using the markerOrganizer function
        level1Markers.push(markerOrganizer("lime", feature));
        level2Markers.push(markerOrganizer("green", feature));
        level3Markers.push(markerOrganizer("yellow", feature));
        level4Markers.push(markerOrganizer("orange", feature));
        level5Markers.push(markerOrganizer("red", feature));
        level6Markers.push(markerOrganizer("maroon", feature));

        // Create the markerOrganizer function
        // The function will take an argument in string format to identify which marker goes to which group
        // The function also creates the type of marker we want.
        // The argument should be a name of a color that was pre-defined in the markerColor function
        function markerOrganizer(color, feature) {
            if (color === markerColor(feature.properties.mag)) {
                L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                    color: markerColor(feature.properties.mag),
                    fillColor: markerColor(feature.properties.mag),
                    fillOpacity: 0.75,
                    radius: markerSize(feature.properties.mag)
                });
            }
        }

        // Create popups for each layer
        LOW.eachLayer(function() {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        });

        LOW_MEDIUM.eachLayer(function() {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        });

        MEDIUM.eachLayer(function() {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        });

        MEDIUM_HIGH.eachLayer(function() {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        });

        HIGH.eachLayer(function() {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        });

        EXTREME.eachLayer(function() {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        });

    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

// Create a function to create a map
function createMap(earthquakes) {

    // Create the tile layer
    var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Street Map": streetMap
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [streetMap, earthquakes]
    });

    // Create a layer control to pass in the baseMaps and OverlayMaps, then add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
