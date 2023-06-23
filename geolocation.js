// Geolocation API ==========================================================
// Provides the geolocation information when users want. Geolocation APIs are accessed via calls to "navigator.geolocation". The browser asks users for permission to access their location. If users give permission, the browser accesses this information using the best features available on the device (e.g., GPS).
// Only works in HTTPS:


// Property ==================================================================
// navigator.geolocation
//**readable only property. Return the Geoloation OBJECT (coors) when a web-content access to the geolocation information on a device.// 


// Get HTML elements & AddEventListener ======================================

const displayGeo = document.getElementById("displayGeo");
const getGeobtn = document.getElementById("geobtn")

// Get current position() method =============================================

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, optionObj);
        } else {
            displayGeo.innerText = "";
            const errorMsg = document.createElement("p");
            errorMsg.innerText = `Geolocation in not supported by this browser.`
        }
    }

// Display the location ======================================================
getGeobtn.addEventListener("click", getLocation);


// SuccessCall back ==========================================================

const successCallback = (x) => {
    console.log(x);
    const latitude = x.coords.latitude;
    const longitude = x.coords.longitude;
    // console.log(latitude); -> OK

    displayGeo.innerText = "";
    const displayLatitude = document.createElement("p");
    const displayLongitude = document.createElement("p");
    displayLatitude.innerText = `Latitude: ${latitude}`;
    displayLongitude.innerText = `Longitude: ${longitude}`;

    displayGeo.appendChild(displayLatitude);
    displayLatitude.append(displayLongitude);
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
    errorMsg.innerHTML = `error#${error.code}: ${errorArr[error.code]}`;
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

const optionObj = {
    timeout: 5000,
    enableHighAccuracy: false,
    maximumAge: 0,
}

// // Watch position =========================================================
// const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);

// // Clear Watch method =====================================================
// navigator.geolocation.clearWatch(watchId);


//Tomtom API

const APIKEY = "ptANjRylatoh5zEIajtZ3GGJe2GLI6ZS";


// Reverse Geo Coding ==============================

const reverseGeoBaseURL = "https://api.tomtom.com/search/2/reverseGeocode/";
const ext = "json";
const position = "lat,lon";

async function getReverseLocation( (reverseGeoBaseURL + '.' + ext + '?' + APIKEY) => {

    const res = await fetch(url)
    const data = await res.json()
    const getData = data.addresses.address;
    const getAddress = getData.freefromAddress; // get address(street# & streetName & municipality & countrySubdivision & Postalcode  i.g 4085 Ash Street, Vancouver BC V5Z 3G1);

    document.getElementById("displayRevGeo").innerHTML = getAddress;
})

getReverseLocation();




//Geo Coding ====================================

const geoBaseURL = "https://api.tomtom.com/search/2/geocode/";

const address = document.getElementById("address").value

async function getGeoLocation( (geoBaseURL + address + ext + '?' + APIKEY) => {

    const res = await fetch();
    const data = await res.json();
    const getData = data.results.position; //get latitude & logititude;

    document.getElementById("displayGeo").innerHTML = getData;

})

document.getElementById('submit').addEventListener("click", ()=>{
    getGeoLocation();
})

document.getElementById("reset").addEventListener("click", ()=>{
    address.reset();
})

