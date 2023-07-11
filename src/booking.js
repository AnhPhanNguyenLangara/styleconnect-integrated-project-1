const bookingDetail = document.querySelector('#booking-detail');
const url = window.location.href;
const searchParams = new URL(url).searchParams;
const entries = new URLSearchParams(searchParams).values();
const array = Array.from(entries);
const obj = JSON.parse(array[0])
const fetchId = obj.userId

bookingDetail.innerHTML =
  `
<h3 id="fullname">${obj.firstName} ${obj.lastName}</h3>
<p id="address">${obj.address} ${obj.city} ,${obj.country}</p>
<p id="bio">${obj.bio}</p>
<div class="listservice">
</div>
`



import {
  initializeApp
} from 'firebase/app'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
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
<<<<<<< Updated upstream

// init services
const db =getFirestore();
=======
// init services
const db = getFirestore();
const colRefListing = collection(db, 'pros_listing_v2');
const colRefProsProfile = collection(db, 'professional_profile_v2')

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
const auth = getAuth();

let currentUserUID = null;
let prosId;
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    currentUserUID = user.uid;
    prosId = await getProsId(currentUserUID);
    // ...
  } else {
    // User is signed out
    // ...
  }
});


async function getProsId(currentUserUID) {
  const queryProsRef = query(colRefProsProfile, where('customerId', '==', currentUserUID));
  const prosIdSnap = await getDocs(queryProsRef);
  return prosIdSnap.docs[0].data().userId;
}

>>>>>>> Stashed changes


const colRefListing = collection(db, 'pros_listing_v2');
async function fetchListingData() {
  try {
    const queryRef = query(colRefListing, where('userId', '==', fetchId));
    const snapshot = await getDocs(queryRef);
    let listing = [];
    snapshot.forEach((x) => listing.push(x.data()));
    return listing;
  } catch (err) {
    console.error(err);
  }
}
const fecthLising = await fetchListingData();
const bookingListing = document.querySelector('#booking-listing');
fecthLising.forEach((x, index) => {
  let label = document.createElement("label");
  label.innerText = x.service + " " + x.price + " CAD";
  let input = document.createElement("input");
  input.type = "radio";
  input.value = x.listingId
  input.name = "listing"
  input.checked = index === 0 ? 'checked' : false;
  bookingListing.appendChild(label);
  bookingListing.appendChild(input);

})

const bookService = document.querySelector('#book-service');
<<<<<<< Updated upstream
bookService.addEventListener('click',(e)=>{
    let radio = document.getElementsByName('listing');
    const customerId = document.getElementById('userId');
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked){
        bookService.href = `/dist/bookingConfirm.html?${radio[i].value}?${customerId.value}?${obj.userId}`;
        }
    }

})
=======
bookService.addEventListener('click', (e) => {
  let radio = document.getElementsByName('listing');
  if (prosId === obj.userId) {
    e.preventDefault();
    alert('Cannot book you own services')
    return;
  }
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      bookService.href = `/dist/bookingConfirm.html?${radio[i].value}?${currentUserUID}?${obj.userId}`;
    }
  }
});
>>>>>>> Stashed changes
