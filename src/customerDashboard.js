import {
  showMenu
} from './menuStart.js';

import {
  initializeApp
} from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  query,
  where,
  updateDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD7wzxQRs4mKcMOB0Vcydzdxl0NRtZbXno",
  authDomain: "styleconnect-e781a.firebaseapp.com",
  projectId: "styleconnect-e781a",
  storageBucket: "styleconnect-e781a.appspot.com",
  messagingSenderId: "700825424755",
  appId: "1:700825424755:web:a0fcfadde53d4248912b06",
  measurementId: "G-BW2ZJHSJ2G",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
let currentUserUID = null;
onAuthStateChanged(auth, async (user) => {
  showMenu(user);
  if (user) {
    currentUserUID =user.uid
    // Fetch bookings immediately after user logs in
    fetchBookings(currentUserUID);
  } else {
    // User is signed out
    // Clear out existing bookings
    bookingDetail.innerHTML = "";
  }
});

// collection ref
const colRef = collection(db, 'customer_booking');
const colRefProsProfile = collection(db, 'professional_profile_v2');

const ratingSubmit = document.querySelector('#rating-form');
const bookingDetail = document.querySelector('#booking-detail');
const starDialog = document.getElementById("star-dialog");
const confirmBtn = starDialog.querySelector("#confirmBtn");
const logOut = document.getElementById('log-out');

logOut.addEventListener('click', (e) => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
})

function fetchBookings(uid) {
  const data = query(colRef, where('customerId', '==', uid));
  onSnapshot(data, async (snapshot) => {
    bookingDetail.innerHTML = "";
    if (snapshot.empty) {
      // No bookings found
      bookingDetail.innerHTML = "<p>No bookings found</p>";
    } else {
      for (let doc of snapshot.docs) {
        let record = await createRecord(doc);
        bookingDetail.appendChild(record);
      }
    }
  });
}


async function createRecord(record) {
  const data = record.data();
  const currentDate = new Date();
  const bookingDate = record.data().bookingtime.toDate();
  const div = document.createElement("div");
  div.classList.add('booking-history-customer');
  const btn = document.createElement("button");
  const where = data.where === 'onlocation'? 'The professional will service at your location':  `<p>You need to visit the professional address for the service</p><button class="serviceAddressButton" data="${data.address}">Click to see the address</button>`

  
  let formattedDate = await convertDate(bookingDate)
  btn.innerText = "Rate this service";
  btn.addEventListener("click", () => {
    starDialog.setAttribute('docId', record.id);
    starDialog.setAttribute('prosId', record.data().prosId);
    starDialog.showModal();
  })
  const prosData = await prosFectching(data.prosId);
  const paragraph1 = document.createElement("p");
  const paragraph2 = document.createElement("div");
  if (data.accepted && isNaN(data.rating) && currentDate >= bookingDate) {
    paragraph1.textContent = `Available to Rate for ${prosData.firstName} Booking at ${formattedDate} `
  } else if (!isNaN(data.rating)) {
    const starSpan = document.createElement('span');
    const serviceSpan = document.createElement('span');
    starSpan.textContent = "★"
    serviceSpan.textContent = "for their service"
    starSpan.classList.add('star-span');
    serviceSpan.classList.add('service-span');
    btn.disabled = true;
    paragraph1.textContent = `Booking at ${formattedDate} -- You gave ${prosData.firstName} ${data.rating}`;
    paragraph1.appendChild(starSpan);
    paragraph1.appendChild(serviceSpan);
  } else {
    btn.disabled = true;
    paragraph1.textContent = data.accepted?`You can rate after the service is completed at ${formattedDate} `:`Waiting accept from ${prosData.firstName}`;
    paragraph2.innerHTML = where;
  }
  div.appendChild(paragraph1);
  div.appendChild(paragraph2);
  div.appendChild(btn);
  return div;
}


async function convertDate(date){
  let formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
    date.getDate().toString().padStart(2, '0') + '/' +
    date.getFullYear().toString().substr(-2) + ' TIME:' +
    date.getHours().toString().padStart(2, '0') + ':' +
    date.getMinutes().toString().padStart(2, '0');
    return formattedDate
}


async function prosFectching(prosId) {
  const prosTemp = await getDoc(doc(db, 'professional_profile_v2', prosId)).then((prosSnap) => {
    return prosSnap.data()
  });
  return prosTemp;
}
// Get rating data
ratingSubmit.addEventListener("change", (e) => {
  e.preventDefault();
  confirmBtn.value = document.querySelector('input[name="star"]:checked').value;
});

// "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
starDialog.addEventListener("close", async (e) => {
  const starRadios = document.querySelectorAll('input[name="star"]');
  starRadios.forEach(radio => {
    radio.checked = false;
  });
  if (starDialog.returnValue != 'cancel') {
    const docId = starDialog.getAttribute('docId');
    const prosId = starDialog.getAttribute('prosId');
    const docRef = doc(colRef, docId);
    const proRef = doc(colRefProsProfile, prosId);
    const prosData = await ratingFetching(prosId);
    const prosRating = isNaN(prosData.rating)? +starDialog.returnValue : ((+starDialog.returnValue + (prosData.rating * +prosData.ratingCount)) / (+prosData.ratingCount + 1)).toFixed(2);
    const prosRatingCount = isNaN(prosData.ratingCount)? 1: (prosData.ratingCount + 1)

    const reviewText = document.querySelector('#review-text').value;
    
    await updateDoc(docRef, {
      rating: starDialog.returnValue,
      review: reviewText
    })
    await updateDoc(proRef, {
      rating: prosRating,
      ratingCount:+prosRatingCount
    })
    document.querySelector('#review-text').value = '';
  }
});


// Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
confirmBtn.addEventListener("click", (event) => {
  event.preventDefault(); // We don't want to submit this fake form
  starDialog.close(confirmBtn.value); // Have to send the select box value here.
});

async function ratingFetching(prosId) {
  const prosData = await getDoc(doc(db, 'professional_profile_v2' , prosId)).then((snapshot) => {
    return snapshot.data()
  });
  return prosData;
}







// TOMTOM

bookingDetail.addEventListener("click", function(e) {
  if(e.target.className === "serviceAddressButton") {
      // Check if clicked element is a serviceAddress button.
      const address = e.target.getAttribute("data");
      mapDialog.showModal();
      loadMap(address)
  }
});


// import { getCustomerAddress } from './addressPic';
import { default as ttServices } from "@tomtom-international/web-sdk-services";
import { default as ttMaps } from "@tomtom-international/web-sdk-maps";
const mapDialog = document.getElementById("map-dialog");
// setting and showing a map
const APIKEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";

// display the distance.

// When open the map page, the map and start point automatically displayed.
const successCallback = (currentLocation) => {
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

