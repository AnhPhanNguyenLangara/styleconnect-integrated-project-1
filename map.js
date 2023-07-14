// setting and showing a map
let APIKEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";
let startPoint = [];
let goalPoint = [];
// let Vancouver = [-123.1207, 49.2827];


// create map object with SDK to show the map
let map = tt.map({
    key: 'ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG',
    container: 'map',
    dragPan: !isMobileOrTablet()
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

function createMarkerElement(markerType) {
    // element is the container of an icon
    let element = document.createElement("div")
    // innerElement is an icon itself
    let innerElement = document.createElement("div")

    element.className = 'route-marker';
    innerElement.className = 'icon tt-icon -white -' + markerType;
    element.appendChild(innerElement);
    return element;
}


// add markers at the start point and end point in the map.
function addMarkers(feature) {
    let startPoint, endPoint;
    if (feature.geometry.type === 'MultiLineString') {
        //get only latitude of first point from line array
        // startPoint = feature.geometry.coordinates[0][0]; 
        startPoint = getDeviceLocation();
        // get only latitude of last point from line array using slice
        endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0];
    } else {
        // get an first array which has a latitude and longititude
        // startPoint = feature.geometry.coordinates[0];
        startPoint = getDeviceLocation();;
        endPoint = feature.geometry.coordinates.slice(-1)[0];
    }
    // console.log(geojson);
    // console.log(geojson.features[0].geometry.type);
    // console.log(geojson.features[0].geometry.coordinates[0][0]);
    // console.log(geojson.features[0].geometry.coordinates[0]);

    //add start & end marker (decide the marker type in the tt.Maker()constructor (elemnet: createMarkerElement('start)))
    new tt.Marker({ element: createMarkerElement('start') }).setLngLat(startPoint).addTo(map);
    new tt.Marker({ element: createMarkerElement('finish') }).setLngLat(endPoint).addTo(map);
}


// create a layer 
function findFirstBuildingLayerId() {
    //to access each layers.
    let layers = map.getStyle().layers;

    // go through every layer and find the idex # of fill-extrusion layer which enables to add the 3D or markers.
    for (let index in layers) {
        if (layers[index].type === 'fill-extrusion') {
            return layers[index].id;
        }
    }
    // display error if there is fill-extrusion layer.
    throw new Error('Map style does not contain any layer with fill-extrusion type.');
}

// get a route only when user access the page or reload. 
map.once('load', function() {
    tt.services.calculateRoute({
        key: 'ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG',
        traffic: false,
        locations: `${getDeviceLocation()}:${getGeoLocation()}`
    })
        .then(function(response) {
            var geojson = response.toGeoJson();
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': geojson
                },
                'paint': {
                    'line-color': '#4a90e2',
                    'line-width': 8
                }
            }, findFirstBuildingLayerId());

            addMarkers(geojson.features[0]);


            var bounds = new tt.LngLatBounds();
            geojson.features[0].geometry.coordinates.forEach(function(point) {
                bounds.extend(tt.LngLat.convert(point));
            });
            map.fitBounds(bounds, { duration: 0, padding: 50 });
        });        
});

// get Device location

function getDeviceLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, optionObj);
    } else {
        const displayError = document.getElementById("displayError");
        displayError.innerText = "";
        displayError.innerText = `Geolocation in not supported by this browser.`;
    }
}

// When open the map page, the map and start point automatically displayed. 

const successCallback = (currentLocation) => {
    console.log(currentLocation);
    const latitude = currentLocation.coords.latitude;
    const longitude = currentLocation.coords.longitude;
    startPoint = [latitude, longitude];

    // let startPosition = new tt.Marker().setLngLat(startPoint).addTo(Map);

    // position = `${latitude},${longitude}`;
    // getReverseLocation();
}

const errorCallback = (error) => {
    const errorArr = [
        "An unknown error occurred.",
        "User denied the request for Geolocation.",
        "Location information is unavailable.",
        "The request to get user location timed out."
    ];
    // console.error(error) -> OK

    displayGeo.innerText = "";

    const errorMsg = document.createElement("p");
    const errorNo = error.code;
    errorMsg.innerHTML = `error#${errorNo}: ${errorArr[errorNo]}`;
    displayGeo.appendChild(errorMsg);
}

const optionObj = {
    timeout: 5000,
    enableHighAccuracy: false,
    maximumAge: 0,
}


// conver user's address into a latitude and longitude after get User's location from user's booking

const geoBaseURL = "https://api.tomtom.com/search/2/geocode/";
// console.log(geoBaseURL);

let address = "";

async function getGeoLocation(getCustomerAddress) {
    const url= geoBaseURL + encodeURI(getCustomerAddress) + '.' + ext + '?key=' + APIKEY;
    const res = await fetch(url);
    const data = await res.json();
    const getData = data.results[0].position; //get latitude & logititude;

    new tt.Marker().setLngLat([getData.lat, getData.lon]).addTo(map)
}