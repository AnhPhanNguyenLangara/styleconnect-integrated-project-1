import { showMenu } from './menuStart.js';
const bookingDetail = document.querySelector('#booking-detail');
const bookingTime = document.querySelector('#booking-time');
const whereDescription = document.querySelector('#where-description');

const url = window.location.href;
const arr = url.split('?')
import {
  initializeApp
} from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  setDoc,
  getDoc
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD7wzxQRs4mKcMOB0Vcydzdxl0NRtZbXno",
  authDomain: "styleconnect-e781a.firebaseapp.com",
  projectId: "styleconnect-e781a",
  storageBucket: "styleconnect-e781a.appspot.com",
  messagingSenderId: "700825424755",
  appId: "1:700825424755:web:a0fcfadde53d4248912b06",
  measurementId: "G-BW2ZJHSJ2G"
};


// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore();
// get UID
import { getAuth, onAuthStateChanged } from "firebase/auth";
// collection ref
const colRef = collection(db, 'customer_booking');
let addressData = null;
const auth = getAuth();
let currentUserUID = null
onAuthStateChanged(auth, async (user) => {
  console.log(arr[4], user)
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
     currentUserUID = user.uid;
    
    if(arr[4] ==="onhome"){
      addressData = await addressFectching(arr[3], 'professional_profile_v2');

      // addressData broken, using fixed address string for demo
      const geoCodeResponse= await fetch(encodeURI(`https://api.tomtom.com/search/2/geocode/989 Beatty Street.json?key=ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG`));
      const geoCodeJSON= await geoCodeResponse.json();
      const coordinates= geoCodeJSON.results[0].position;

      whereDescription.innerHTML = `<h4>For this booking, you will need to go and get the service at the professional's location as per below address.</h4>
      <p>989 Beatty Street</p>
      <img src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+ff2600(${coordinates.lon},${coordinates.lat})/${coordinates.lon},${coordinates.lat},10,0/400x400@2x?access_token=pk.eyJ1IjoicG5ndXllbjYzIiwiYSI6ImNsazk1aWlxNTA2djIzZWxueHo4M2NjbWIifQ.Gl4sErrXg13DhcvO_qgDMw" alt="">`
    }else{
      addressData = await addressFectching(arr[2], 'customer_profile');
      whereDescription.innerHTML = `<h4>For this booking, the professional will come to your location as per below address.</h4>
      <p>${addressData.address1}</p>`
    }
    // ...
  } else {
    // User is signed out
    // ...
    showMenu()
  }
});

async function addressFectching(Id, type) {
  const customerTemp = await getDoc(doc(db, type , Id)).then((snapshot) => {
    return snapshot.data()
  });
  return customerTemp;
}


const confirmBooking = document.querySelector('.add')

confirmBooking.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const bookingDate = new Date(confirmBooking.bookingTime.value);
    console.log(currentUserUID)
    const colRefCustomer =  doc(db, 'customer_profile', currentUserUID);
    let customerData = (await getDoc(colRefCustomer)).data();
    let firebastTime = Timestamp.fromDate(bookingDate);
    const docRef = doc(colRef);
    await setDoc(docRef, {
      customerId: arr[2],
      bookingId: docRef.id,
      bookingtime: firebastTime,
      customerfirstName: customerData.firstName,
      customerlastName: customerData.lastName,
      address: addressData.address1,
      serviceName: arr[5],
      where: arr[4],
      prosId: arr[3],
      listingId: arr[1],
      accepted: false,
      createdAt: serverTimestamp()
    })
    confirmBooking.reset()
    window.location.assign("customerDashboard.html");
  } catch (error) {
    console.log(error);
  }
  alert('Booking Confirm')
  /* window.location.href = '/dist/'; */
})

// import { getCustomerAddress } from './addressPic';
import { default as ttServices } from "@tomtom-international/web-sdk-services";
import { default as ttMaps } from "@tomtom-international/web-sdk-maps";

// setting and showing a map
const APIKEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";

// display the distance.

// When open the map page, the map and start point automatically displayed.
const successCallback = (currentLocation) => {
  console.log(currentLocation.coords);
  return currentLocation.coords;
};
const errorCallback = (error) => {
  const errorArr = [
    "An unknown error occurred.",
    "User denied the request for Geolocation.",
    "Location information is unavailable.",
    "The request to get user location timed out.",
  ];
  console.error(error)

  // displayGeo.innerText = "";

  // const errorMsg = document.createElement("p");
  // const errorNo = error.code;
  // errorMsg.innerHTML = `error#${errorNo}: ${errorArr[errorNo]}`;
  // displayGeo.appendChild(errorMsg);
};
const optionObj = {
  timeout: 5000,
  enableHighAccuracy: false,
  maximumAge: 0,
};


function getPosition(options) {
    return new Promise((successCallback, errorCallback) => 
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)
    );
}

// create map object with SDK to show the map
let map = ttMaps.map({
  key: APIKEY,
  container: "map",
  // dragPan: !isMobileOrTablet()
});
map.addControl(new ttMaps.FullscreenControl());
map.addControl(new ttMaps.NavigationControl());



// creat markers
function createMarkerElement(markerType) {
  // element is the container of an icon
  let element = document.createElement("div");
  // innerElement is an icon itself
  let innerElement = document.createElement("div");

  element.className = "route-marker";
  innerElement.className = "icon tt-icon -white -" + markerType;
  element.appendChild(innerElement);
  return element;
}

// add markers at the start point and end point in the map.
function addMarkers(feature) {
    var startPoint, endPoint;
    if (feature.geometry.type === 'MultiLineString') {
        startPoint = feature.geometry.coordinates[0][0]; //get first point from first line
        endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]; //get last point from last line
    } else {
        startPoint = feature.geometry.coordinates[0];
        endPoint = feature.geometry.coordinates.slice(-1)[0];
    }

    new ttMaps.Marker({ element: createMarkerElement('start') }).setLngLat(startPoint).addTo(map);
    new ttMaps.Marker({ element: createMarkerElement('finish') }).setLngLat(endPoint).addTo(map);
}

// create a layer to show route & markers
function findFirstBuildingLayerId() {
  //to access each layers.
  let layers = map.getStyle().layers;

  // go through every layer and find the idex # of fill-extrusion layer which enables to add the 3D or markers.
  for (let index in layers) {
    if (layers[index].type === "fill-extrusion") {
      return layers[index].id;
    }
  }
  // display error if there is fill-extrusion layer.
  throw new Error(
    "Map style does not contain any layer with fill-extrusion type."
  );
}

// // get a route only when user access the page or reload.
// var resultsManager = new ResultsManager();

map.once("load", async() => {
    Promise.all([getPosition(optionObj),getCustomerLocation()]).then(function (results) {
    console.log(results[0]);
    console.log(results[1]);
    ttServices.services
      .calculateRoute({
        key: APIKEY,
        traffic: false,
        locations: `${results[0].coords.longitude},${results[0].coords.latitude}:${results[1].lon},${results[1].lat}`,
      })
      //response is the route info and convert it to JSON.
      .then(function (response) {
        let geojson = response.toGeoJson();
        map.addLayer(
          {
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: geojson,
            },
            paint: {
              "line-color": "#4a90e2",
              "line-width": 8,
            },
          },
          findFirstBuildingLayerId()
        );
        addMarkers(geojson.features[0]);

        // resultsManager.success();
        // resultsManager.append(createSummaryContent(geojson.features[0].properties.summary));

        let bounds = new ttMaps.LngLatBounds();
        geojson.features[0].geometry.coordinates.forEach(function (point) {
          bounds.extend(ttMaps.LngLat.convert(point));
        });
        map.fitBounds(bounds, { duration: 0, padding: 50 });
      });
  });
});

// Convert user's address into a latitude and longitude using user's booking information

const geoBaseURL = "https://api.tomtom.com/search/2/geocode/";
const ext = "json";
// console.log(geoBaseURL);

async function getCustomerLocation() {
  try {
    const address = "989 Beatty Street";
    const url = geoBaseURL + encodeURI(address) + "." + ext + "?key=" + APIKEY;
    const res = await fetch(url);
    const data = await res.json();
    const position = data.results[0].position; //get latitude & logititude;
    console.log(position);
    return position;
  } catch (error) {
    console.error("Error", error);
  }
}

