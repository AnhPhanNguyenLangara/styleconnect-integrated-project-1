import { getCustomerAddress } from './addressPic';
import { default as ttServices } from "@tomtom-international/web-sdk-services";
import { default as ttMaps } from "@tomtom-international/web-sdk-maps";

// setting and showing a map
const APIKEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";

// display the distance.
function displayAddress() {
    document.getElementById("destination").innerHTML = getCustomerAddress();
}


// create map object with SDK to show the map
let map = ttMaps.map({
    key: APIKEY,
    container: 'map'
    // dragPan: !isMobileOrTablet()
});
map.addControl(new ttMaps.FullscreenControl());
map.addControl(new ttMaps.NavigationControl());


// // get a middle position between device location and customer's location
// async function calcMidPoint() {
//     try {
//         let deviceLocation = await getDeviceLocation();
//         let customerLocation = await getCustomerLocation();

//         let lat1 = deviceLocation.latitude;
//         let lon1 = deviceLocation.longitude;
//         let lat2 = customerLocation.latitude;
//         let lon2 = customerLocation.longitude;

//         let midLat = (lat1 + lat2) / 2;
//         let midLon = (lon1 + lon2) / 2;

//         return [midLat, midLon];
//     }
//     catch (error) {
//         console.error("Error", error);
//     }
// }


// creat markers
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
async function addMarkers(feature) {
    try {
        let startPoint, endPoint;
        if (feature.geometry.type === 'MultiLineString') {
            //get only latitude of first point from line array
            let deviceLocation = getDeviceLocation();
            startPoint = deviceLocation.latitude;

            // get only latitude of last point from line array using slice
            let customerLocation = getCustomerLocation();
            endPoint = customerLocation.latitude;

            // endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0];
        } else {
            // get an first array which has a latitude and longititude
            // startPoint = feature.geometry.coordinates[0];
            startPoint = getDeviceLocation();
            endPoint = getCustomerLocation();
            // endPoint = feature.geometry.coordinates.slice(-1)[0];
        }
        // console.log(geojson);
        // console.log(geojson.features[0].geometry.type);
        // console.log(geojson.features[0].geometry.coordinates[0][0]);
        // console.log(geojson.features[0].geometry.coordinates[0]);

        //add start & end marker (decide the marker type in the tt.Maker()constructor (elemnet: createMarkerElement('start)))
        new ttMaps.Marker({ element: createMarkerElement('start') }).setLngLat(startPoint).addTo(map);
        new ttMaps.Marker({ element: createMarkerElement('finish') }).setLngLat(endPoint).addTo(map);
        displayAddress();
    } catch (error) {
        console.error("Error:", error)
    }
}


// create a layer to show route & markers
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
var resultsManager = new ResultsManager();

map.once('load', function () {
    ttServices.services.calculateRoute({
        key: APIKEY,
        traffic: false,
        locations: `${getDeviceLocation()}:${getCustomerLocation()}`
    })
    //response is the route info and convert it to JSON.
        .then(function (response) {
            let geojson = response.toGeoJson();
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

            resultsManager.success();
            resultsManager.append(createSummaryContent(geojson.features[0].properties.summary));

            let bounds = new ttMaps.LngLatBounds();
            geojson.features[0].geometry.coordinates.forEach(function (point) {
                bounds.extend(ttMaps.LngLat.convert(point));
            });
            map.fitBounds(bounds, { duration: 0, padding: 50 });
        });
});


// Convert user's address into a latitude and longitude using user's booking information

const geoBaseURL = "https://api.tomtom.com/search/2/geocode/";
const ext = "json"
// console.log(geoBaseURL);

async function getCustomerLocation(customerAddress) {
    try {
        const address = await getCustomerAddress(customerAddress)
        const url = geoBaseURL + encodeURI(address) + '.' + ext + '?key=' + APIKEY;
        const res = await fetch(url);
        const data = await res.json();
        const position = data.results[0].position; //get latitude & logititude;
        return position;
    } catch (error) {
        console.error("Error", error);
    }
}


// get Pro's Device location
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
    // console.log(currentLocation);
    const latitude = currentLocation.coords.latitude;
    const longitude = currentLocation.coords.longitude;
    let startPoint = [latitude, longitude];
    return startPoint;
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


// Route summary

let detailsWrapper = document.createElement('div');
let summaryContent = document.createElement('div');
let summaryHeader = "";

function createSummaryContent(feature) {
    if (!summaryHeader) {
        summaryHeader = DomHelpers.elementFactory('div', 'summary-header', 'Route summary');
        summaryContent.appendChild(summaryHeader);
    }
    let detailsHTML =
        '<div class="summary-details-bottom">' +
            '<div class="summary-icon-wrapper">' +
                '<span class="tt-icon -car -big"></span>' +
            '</div>' +
            '<div class="summary-details-text">' +
                '<span class="summary-details-info">Distance: <b>' +
                    Formatters.formatAsMetricDistance(feature.lengthInMeters) +
                '</b></span>' +
                '<span class="summary-details-info -second">Arrive: <b>' +
                    Formatters.formatToExpandedDateTimeString(feature.arrivalTime) +
                '</b></span>' +
            '</div>' +
        '</div>';

    detailsWrapper.innerHTML = detailsHTML;
    summaryContent.appendChild(detailsWrapper);
    return summaryContent;
}