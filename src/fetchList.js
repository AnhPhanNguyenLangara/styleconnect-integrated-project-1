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

// init services
const db = getFirestore();


const colRefListing = collection(db, 'pros_listing_v2');
const fetchListing = document.getElementById('fetchListing');
let prosListArr;

fetchListing.addEventListener('submit', async (e) => {
  e.preventDefault();
  let y = await fetchListingData();
  displayListing(y);
})


async function fetchListingData() {
  try {
    const queryRef = query(colRefListing, where('userId', '==', fetchListing.userId.value));
    const snapshot = await getDocs(queryRef);
    let listing = [];
    snapshot.forEach((x) => listing.push(x.data()));
    return listing;
  } catch (err) {
    console.error(err);
  }
}

const listCard = document.getElementById('listing-display')
const displayListing = async (listingPromise) => {
  prosListArr = listingPromise;
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