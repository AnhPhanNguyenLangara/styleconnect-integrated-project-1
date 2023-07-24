import { showMenu } from './menuStart.js';

import {
  initializeApp
} from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc
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
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
let prosId = null;
const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  showMenu(user);
  if (user) {
    prosId = await getProsId(user.uid);
    let bookingData = await fetchBookingData(prosId);
    displayBooking(bookingData);
    fetchListingData(prosId);
  } else {
    // User is signed out
    // ...

  }
});



// init services
const db = getFirestore();
const colRefBooking = collection(db, 'customer_booking');
const colRefListing = collection(db, 'pros_listing_v2');
const colRefProsListing = collection(db, 'pros_listing_v2');
const colRefProsProfile = collection(db, 'professional_profile_v2')

// fetch prosId
async function getProsId(currentUserUID) {
  const queryProsRef = query(colRefProsProfile, where('customerId', '==', currentUserUID));
  const prosIdSnap = await getDocs(queryProsRef);
  return prosIdSnap.docs[0].data().userId;
}

// get Booking request Data
async function fetchBookingData(prosId) {
  try {
    const queryRef = query(colRefBooking, where('prosId', '==', prosId));
    const snapshot = await getDocs(queryRef);
    let listing = [];
    
    snapshot.forEach((x) => listing.push(x.data()));
    return listing;
  } catch (err) {
    console.error(err);
  }
}



const bookCard = document.getElementById('booking-request')
const displayBooking = async (bookingPromise) => {
  let bookListArr = await bookingPromise;
  
  // If no booking requests
  if (bookListArr.length === 0) {
    bookCard.innerHTML = "<p>No booking requests found.</p>";
    return;
  }

  let listingDisplay = "";
  bookListArr.forEach((x) => {
    let bookingType = x.where ==="onhome"? 'On Your Location': 'On Customer Location' ;
    let serviceAddress = x.where ==="onhome"? '<p>Customer will visit your place</p>': `<button class="serviceAddressButton" data="${x.address}">Click to see the address</button>` ;
    listingDisplay += `<div class="listing-tab">
        <h4 id="serviceName">${bookingType}</h4>
        <p>Customer Name:${x.customerfirstName} ${x.customerlastName}</p>
        <p>Service Name: ${x.serviceName}</p>
        ${serviceAddress}
        ${
          x.accepted
            ? `<button data="${x.bookingId}">RESCHEDULE</button> <button data="${x.bookingId}" class="cancel">CANCEL</button>`
            : `<button data="${x.bookingId}" class="confirm">CLICK TO CONFIRM</button> <button data="${x.bookingId}" class="cancel">CANCEL</button>`
        }
      </div>`;
  })
  bookCard.innerHTML = listingDisplay;
}

bookCard.addEventListener("click", function(e) {
  if(e.target.className === "serviceAddressButton") {
      // Check if clicked element is a serviceAddress button.
      const address = e.target.getAttribute("data");
      mapDialog.showModal();
      loadMap(address)
  }
});

function fetchListingData(prosId) {
  const queryRef = query(colRefListing, where('userId', '==', prosId));
  onSnapshot(queryRef, (snapshot) => {
    let listing = [];
    snapshot.forEach((x) => listing.push(x.data()));
    displayListing(listing);
  }, (err) => {
    console.log(err);
  });
}

const listCard = document.getElementById('listing-display')

function displayListing(prosListArr) {
  // If no listings
  if (prosListArr.length === 0) {
    listCard.innerHTML = "<p>No listings found.</p>";
    return;
  }
  let listingDisplay = "";
  prosListArr.forEach((x) => {
    let obj = {
      listingId: x.listingId,
      country: x.country,
      onhome: x.onhome,
      onlocation: x.onlocation,
      servicedescription: x.servicedescription,
      price: x.price,
      service: x.service,
    }
    const searchParams = new URLSearchParams();
    searchParams.append('v1', JSON.stringify(obj))

    let queryString = searchParams.toString();
    listingDisplay += `
        <div class="listing-tab">
        <h4 id="serviceName">Service: ${x.service}</h4>
        <p id="servicePrice">Price: ${x.price}</p>
        <a href="editlisting.html?${queryString}" class="btn btn-show btn-animated" id="edit">Edit</a>
        </div>`;
  })
  listCard.innerHTML = listingDisplay;
}
// Event handler for confirm/cancel request
bookCard.addEventListener('click', async (e) => {
  let button = e.target;
  let bookingId = button.getAttribute("data");
  if (e.target.classList.value === 'confirm') {
    if (confirm('Are you sure you want to accept this booking?')) {
      try {
        const docRef = doc(colRefBooking, bookingId);
        await updateDoc(docRef, {
          accepted: true
        })
      } catch (error) {
        console.log(error);
      }
      toastDisplay("Your schedule has been confirmed")
    } else {
      console.log('Confirmation cancelled!');
    }
  } else if (e.target.classList.value === 'cancel') {
    if (confirm('Are you sure you want to cancel?')) {
      try {
        const docRef = doc(colRefBooking, bookingId);
        await updateDoc(docRef, {
          accepted: false
        })
      } catch (error) {
        console.log(error);
      }
      toastDisplay("Your schedule has been canceled")
    } else {
      console.log('Cancellation cancelled!');
    }
  }
  let bookingData = await fetchBookingData(prosId);
  displayBooking(bookingData);
});


function toastDisplay(text) {
  let toast = document.getElementById("snackbar");
  // Add the "show" class to DIV
  toast.className = "show";
  toast.innerText = text;
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 1500);
}


// Service listing to firebase
const addServiceForm = document.querySelector('.list');
addServiceForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const newDocRef = doc(colRefProsListing);
    await setDoc(newDocRef, {
      userId: prosId,
      listingId: newDocRef.id,
      onlocation: addServiceForm.onlocation.value,
      onhome: addServiceForm.onhome.value,
      servicedescription: addServiceForm.servicedescription.value,
      service: addServiceForm.service.value,
      price: +addServiceForm.price.value,
      createdAt: serverTimestamp()
    })
    addServiceForm.reset()
  } catch (error) {
    console.log(error);
  }

})


// TOMTOM

// import { getCustomerAddress } from './addressPic';
import { default as ttServices } from "@tomtom-international/web-sdk-services";
import { default as ttMaps } from "@tomtom-international/web-sdk-maps";
const mapDialog = document.getElementById("map-dialog");
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
// Create different marker for the end point
function createEndPointMarkerElement() {
  let element = document.createElement("div");
  let innerElement = document.createElement("div");
  element.className = "route-marker-end"; 
  innerElement.className = "icon tt-icon -red -finish";
  element.appendChild(innerElement);
  return element;
}


// add markers at the start point and end point in the map.
function addMarkers(feature) {
  let startPoint, endPoint;
  if (feature.geometry.type === 'MultiLineString') {
      startPoint = feature.geometry.coordinates[0][0]; //get first point from first line
      endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]; //get last point from last line
  } else {
      startPoint = feature.geometry.coordinates[0];
      endPoint = feature.geometry.coordinates.slice(-1)[0];
  }

  new ttMaps.Marker({ element: createMarkerElement('start') }).setLngLat(startPoint).addTo(map);
  new ttMaps.Marker({ element: createEndPointMarkerElement() }).setLngLat(endPoint).addTo(map);
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

function loadMap(address) {
  document.getElementById("address-line").innerText = address;
  // assign map object to the map variable
  map = ttMaps.map({
    key: APIKEY,
    container: "map",
  });

  // add controls
  map.addControl(new ttMaps.FullscreenControl());
  map.addControl(new ttMaps.NavigationControl());

  // handle map load
  map.once("load", async() => {
    const results = await Promise.all([getPosition(optionObj), getCustomerLocation(address)]);
    ttServices.services
      .calculateRoute({
        key: APIKEY,
        traffic: false,
        locations: `${results[0].coords.longitude},${results[0].coords.latitude}:${results[1].lon},${results[1].lat}`,
      })
      .then(function(response) {
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

        let bounds = new ttMaps.LngLatBounds();
        geojson.features[0].geometry.coordinates.forEach(function(point) {
          bounds.extend(ttMaps.LngLat.convert(point));
        });
        map.fitBounds(bounds, { duration: 0, padding: 50 });
      });
  });
}



// Convert user's address into a latitude and longitude using user's booking information

const geoBaseURL = "https://api.tomtom.com/search/2/geocode/";
const ext = "json";
// console.log(geoBaseURL);

async function getCustomerLocation(address) {
  try {
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


document.getElementById("close-dialog").addEventListener("click", function() {
  mapDialog.close();
});
