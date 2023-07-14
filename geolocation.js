// Geolocation API ==========================================================
// Provides the geolocation information when users want. Geolocation APIs are accessed via calls to "navigator.geolocation". The browser asks users for permission to access their location. If users give permission, the browser accesses this information using the best features available on the device (e.g., GPS).
// Only works in HTTPS:


// Property ==================================================================
// navigator.geolocation
//**readable only property. Return the Geoloation OBJECT (coors) when a web-content access to the geolocation information on a device.// 


// Get HTML elements & AddEventListener ======================================

const displayGeo = document.getElementById("displayGeo");
const getGeobtn = document.getElementById("geobtn");

// Get current position() method =============================================

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, optionObj);
    } else {
        displayGeo.innerText = "";
        const errorMsg = document.createElement("p");
        errorMsg.innerText = `Geolocation in not supported by this browser.`;
        displayGeo.appendChild(errorMsg);
    }
}

// Display the location ======================================================
getGeobtn.addEventListener("click", getLocation);

// SuccessCall back ==========================================================

const successCallback = (x) => {
    console.log(x);
    const latitude = x.coords.latitude;
    const longitude = x.coords.longitude;

    let startPosition = new tt.Marker().setLngLat([latitude],[longitude]).addTo(Map);

    position = `${latitude},${longitude}`;
    getReverseLocation();
    // console.log(latitude); -> OK

    // displayGeo.innerText = "";
    // const displayLatitude = document.createElement("p");
    // const displayLongitude = document.createElement("p");
    // displayLatitude.innerText = `Latitude: ${latitude}`;
    // displayLongitude.innerText = `Longitude: ${longitude}`;

    // displayGeo.appendChild(displayLatitude);
    // displayLatitude.append(displayLongitude);
}


// Error callback ============================================================

const errorCallback = (error) => {
    // error.code# & Error type
    // 0: UNKNOWN_ERROR
    // 1: PERMISSION_DENIED
    // 2: POSITION_UNAVAILABLE
    // 3: TIMEOUT

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

// Plan B (using Switch)
// switch(error.code) {
//     case error.UNKNOWN_ERROR:
//         errorMsg.innerText = `An unknown error occurred`; 
//         displayGeo.appendChild(errorMsg);  
//         break;
//     case error.PERMISSION_DENIED:
//         errorMsg.innerText = `User denied the request for Geolocation.`;
//         displayGeo.appendChild(errorMsg);
//         break;
//     case error.POSITION_UNAVAILABLE:
//         errorMsg.innerText = `Location information is unavailable.`;
//         displayGeo.appendChild(errorMsg);
//         break;
//     case error.TIMEOUT:
//         errorMsg.innerText = `The request to get user location timed out.`;
//         displayGeo.appendChild(errorMsg);
//         break;
// }
}

// OptionObj =================================================================



// // Watch position =========================================================
// const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);

// // Clear Watch method =====================================================
// navigator.geolocation.clearWatch(watchId);


//Tomtom API
const APIKEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";

// Reverse Geo Coding ==============================

const reverseGeoBaseURL = "https://api.tomtom.com/search/2/reverseGeocode/";
const ext = "json";
let position = "lat,lon";

async function getReverseLocation() {
    const url= reverseGeoBaseURL + position + '.' +  ext + '?key=' + APIKEY;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    const getData = data.addresses[0].address;
    console.log(getData);
    const getAddress = getData.freeformAddress;
    console.log(getAddress); // get address(street# & streetName & municipality & countrySubdivision & Postalcode  i.g 4085 Ash Street, Vancouver BC V5Z 3G1);

    document.getElementById("displayRevGeo").innerHTML = getAddress;
}


//Geo Coding ====================================

const geoBaseURL = "https://api.tomtom.com/search/2/geocode/";
console.log(geoBaseURL);

let address = "";

async function getGeoLocation(getCustomerAddress) {

    const url= geoBaseURL + encodeURI(accessAddress) + '.' + ext + '?key=' + APIKEY;
    const res = await fetch(url);
    const data = await res.json();
    const getData = data.results[0].position; //get latitude & logititude;


    //getData is coming from route.html
    new tt.Marker().setLngLat([getData.lat, getData.lon]).addTo(map)
    // document.getElementById("displayGeo").innerHTML = `latitude: ${getData.lat} , longititude: ${getData.lon}`;
}

document.getElementById('submit').addEventListener("click", (e)=>{
    e.preventDefault();
    address = document.getElementById("address").value;
    // console.log(getGeoLocation());
    getGeoLocation();
})

// document.getElementById("reset").addEventListener("click", ()=>{
//     document.getElementById("address") this.reset();
// })