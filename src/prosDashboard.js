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
  let listingDisplay = "";
  bookListArr.forEach((x) => {
    listingDisplay += `<div class="listing-tab">
        <h4 id="serviceName">Booking-Id: <span>${x.bookingId}</span></h4>
        ${
          x.accepted
            ? `<button data="${x.bookingId}">RESCHEDULE</button> <button data="${x.bookingId}" class="cancel">CANCEL</button>`
            : `<button data="${x.bookingId}" class="confirm">CLICK TO CONFIRM</button> <button data="${x.bookingId}" class="cancel">CANCEL</button>`
        }
      </div>`;
  })
  bookCard.innerHTML = listingDisplay;
}


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
  let listingDisplay = "";
  prosListArr.forEach((x) => {
    let obj = {
      listingId: x.listingId,
      country: x.country,
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
  var button = e.target;
  var bookingId = button.getAttribute("data");
  if (e.target.classList.value === 'confirm') {
    if (confirm('Are you sure you want to confirm?')) {
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