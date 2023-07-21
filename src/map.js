import { getCustomerAddress, app, colRefListing, customerIDs } from './addressPic.js';

console.log(getCustomerAddress(customerIDs));

// setting and showing a map
const APIKEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";

// display the distance.
function displayAddress() {
    document.getElementById("address").innerHTML = getCustomerAddress();
};

displayAddress();
// create map object with SDK to show the map
let map = tt.map({
    key: APIKEY,
    container: 'map',
    dragPan: !isMobileOrTablet(),
    // center: calcMidPoint()
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

  // When the map page is opened, the map and start point are automatically displayed.
  const successCallback = (currentLocation) => {
    console.log("Successful callback", currentLocation);
    const latitude = currentLocation.coords.latitude;
    const longitude = currentLocation.coords.longitude;
    console.log("show lat & long", latitude, longitude);
    let startPoint = [latitude, longitude];
    return startPoint;
    // console.log("Start Point Latitude: " + startPoint[0]);
    // console.log("Start Point Longitude: " + startPoint[1]);
  };
  const errorCallback = (error) => {
    console.log("errocall back");
    const errorArr = [
      "An unknown error occurred.",
      "User denied the request for Geolocation.",
      "Location information is unavailable.",
      "The request to get user location timed out.",
    ];
    const displayGeo = document.getElementById("displayGeo");
    displayGeo.innerText = "";
    const errorMsg = document.createElement("p");
    const errorNo = error.code;
    errorMsg.innerHTML = `error#${errorNo}: ${errorArr[errorNo]}`;
    displayGeo.appendChild(errorMsg);
  };

// get a middle position between device location and customer's location
async function calcMidPoint() {
    try {
        let deviceLocation =  getDeviceLocation();
        let customerLocation = await getCustomerLocation();

        let lat1 = deviceLocation.latitude;
        let lon1 = deviceLocation.longitude;
        let lat2 = customerLocation.latitude;
        let lon2 = customerLocation.longitude;

        let midLat = (lat1 + lat2) / 2;
        let midLon = (lon1 + lon2) / 2;

        return [midLat, midLon];
    }
    catch {
        console.error("Error", error);
    }
}


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
    console.log("addMarkers called.");
    try {
        let startPoint, endPoint;
        if (feature.geometry.type === 'MultiLineString') {
            //get only latitude of first point from line array
            let deviceLocation = getDeviceLocation();

            startPoint = deviceLocation.latitude;

            // get only latitude of last point from line array using slice
            let customerLocation = getCustomerLocation();
            endPoint = customerLocation.latitude;
            console.log("this is endPoint", endPoint);
            

            // endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0];
        } else {
            // get an first array which has a latitude and longititude
            // startPoint = feature.geometry.coordinates[0];
            startPoint = getDeviceLocation();
            endPoint = getCustomerLocation();
            console.log("this is endPoint", endPoint);
            // endPoint = feature.geometry.coordinates.slice(-1)[0];
        }
        // console.log(geojson);
        // console.log(geojson.features[0].geometry.type);
        // console.log(geojson.features[0].geometry.coordinates[0][0]);
        // console.log(geojson.features[0].geometry.coordinates[0]);

        //add start & end marker (decide the marker type in the tt.Maker()constructor (elemnet: createMarkerElement('start)))
        new tt.Marker({ element: createMarkerElement('start') }).setLngLat(startPoint).addTo(map);
        new tt.Marker({ element: createMarkerElement('finish') }).setLngLat(endPoint).addTo(map);
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
let resultsManager = new ResultsManager();

map.once('load', function () {
    console.log("loading the map");
    let location = getDeviceLocation();
    console.log("this is line 151", location);
    tt.services.calculateRoute({
        key: APIKEY,
        traffic: false,
        locations: `${location},${getCustomerLocation()}`
    })
    //response is the route info and convert it to JSON.
        .then(function (response) {
            console.log("this is line 148", response);
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

            let bounds = new tt.LngLatBounds();
            geojson.features[0].geometry.coordinates.forEach(function (point) {
                bounds.extend(tt.LngLat.convert(point));
            });
            map.fitBounds(bounds, { duration: 0, padding: 50 });
        });
});


// Convert user's address into a latitude and longitude using user's booking information

const geoBaseURL = "https://api.tomtom.com/search/2/geocode/";
const ext = "json"
// console.log(geoBaseURL);

async function getCustomerLocation() {
    // const snapShot = await getDocs(customerIDs);
    let address = await getCustomerAddress()
    console.log("customerAddress -->", address);
    try {
        // const address = await getCustomerAddress(customerAddress)
        const url = geoBaseURL + address + '.json?key=' + APIKEY;
        console.log(url);
        // https://{baseURL}/search/{versionNumber}/geocode/{query}.{ext}?key={Your_API_Key}&storeResult={storeResult}&typeahead={typeahead}&limit={limit}&ofs={ofs}&lat={lat}&lon={lon}&countrySet={countrySet}&radius={radius}&topLeft={topLeft}&btmRight={btmRight}&language={language}&extendedPostalCodesFor={extendedPostalCodesFor}&view={view}&mapcodes={mapcodes}&entityTypeSet={entityTypeSet}
        // https://api.tomtom.com/search/2/geocode/De Ruijterkade 154, 1011 AC, Amsterdam.json?key={Your_API_Key}
        const res = await fetch(url);
        const data = await res.json();
        console.log("this is Json", data);
        const position = data.results[0].position; //get latitude & logititude;
        console.log("this is position", position);
        return position;
    } catch (error) {
        console.error("Error", error);
    }
}


// get Pro's Device location
// window.addEventListener("load",function getDeviceLocation() {
//     const optionObj = {
//         timeout: 5000,
//         enableHighAccuracy: false,
//         maximumAge: 0,
//     }
    
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(successCallback, errorCallback, optionObj);
//     } else {
//         const displayError = document.getElementById("displayError");
//         displayError.innerText = "";
//         displayError.innerText = `Geolocation in not supported by this browser.`;
//     }
// })


// When open the map page, get the current loction automatically. 
window.addEventListener("load", getDeviceLocation());

function getDeviceLocation() {
    console.log("inside getDeviceLocation");
    const optionObj = {
      timeout: 5000,
      enableHighAccuracy: false,
      maximumAge: 0,
    };
    if (navigator.geolocation) {
        console.log("has geolocation.");
        navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        optionObj
      );
    // return successCallback();
    } else {
        console.log("no geolocation");
      const displayError = document.getElementById("displayError");
      displayError.innerText = "";
      displayError.innerText = "Geolocation is not supported by this browser.";
    }
  };



// Route summary

// let detailsWrapper = document.createElement('div');
// let summaryContent = document.createElement('div');
// let summaryHeader = "";

// function createSummaryContent(feature) {
//     if (!summaryHeader) {
//         summaryHeader = DomHelpers.elementFactory('div', 'summary-header', 'Route summary');
//         summaryContent.appendChild(summaryHeader);
//     }
//     let detailsHTML =
//         '<div class="summary-details-bottom">' +
//             '<div class="summary-icon-wrapper">' +
//                 '<span class="tt-icon -car -big"></span>' +
//             '</div>' +
//             '<div class="summary-details-text">' +
//                 '<span class="summary-details-info">Distance: <b>' +
//                     Formatters.formatAsMetricDistance(feature.lengthInMeters) +
//                 '</b></span>' +
//                 '<span class="summary-details-info -second">Arrive: <b>' +
//                     Formatters.formatToExpandedDateTimeString(feature.arrivalTime) +
//                 '</b></span>' +
//             '</div>' +
//         '</div>';

//     detailsWrapper.innerHTML = detailsHTML;
//     summaryContent.appendChild(detailsWrapper);
//     return summaryContent;
// }