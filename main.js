// Geolocation API ==================================
    // Provides the geolocation information when users want. Geolocation APIs are accessed via calls to "navigator.geolocation". The browser asks users for permission to access their location. If users give permission, the browser accesses this information using the best features available on the device (e.g., GPS).
    // Only works in HTTPS:


// Property ========================================= 
    // navigator.geolocation
    //**readable only property. Return the Geoloation OBJECT (coors) when a web-content access to the geolocation information on a device.// 


// Get HTML elements & AddEventListener =============

const displayGeo = document.getElementById("displayGeo");
const getGeobtn = document.getElementById("geobtn")


// Get current position() method ====================

function getLocation()  {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, optionObj);
    } else {
        displayGeo.innerText = "";
        const errorMsg = document.createElement("p");
        errorMsg.innerText = `Geolocation in not supported by this browser.`
    }
}


// SuccessCall back =================================

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


// Error callback ===================================

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

    // Another way (using Switch)
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


// OptionObj =================================================

const optionObj = {
    timeout: 5000,
    enableHighAccuracy: true,
    maximumAge: 0,
}


// // Watch position =========================================
// const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);

// // Clear Watch method =====================================
// navigator.geolocation.clearWatch(watchId);