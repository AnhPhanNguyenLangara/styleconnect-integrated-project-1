import {
  initializeApp
} from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
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

// init services
const db = getFirestore();
const colRefListing = collection(db, 'customer_booking');
const colRefProsListing = collection(db, 'pros_listing_v2');
const bookingTime = document.querySelector('#booking-time');
const fetchListing = document.getElementById('fetchBooking');
async function fetchBookingData() {
  try {
    const queryRef = query(colRefListing, where('prosId', '==', fetchListing.userId.value));
    const snapshot = await getDocs(queryRef);
    let listing = [];
    snapshot.forEach((x) => listing.push(x.data()));
    return listing;
  } catch (err) {
    console.error(err);
  }
}


fetchListing.addEventListener('submit', async (e) => {
  e.preventDefault();
  let y = await fetchBookingData();
  displayListing(y);
})



const bookCard = document.getElementById('booking-request')
const displayListing = async (bookingPromise) => {
  let bookListArr = await bookingPromise;
  let listingDisplay = "";
  bookListArr.forEach((x) => {
    let obj = {
      listingId: x.listingId,
      accepted: x.accepted
    }
    const searchParams = new URLSearchParams();
    searchParams.append('v1', JSON.stringify(obj))
    let queryString = searchParams.toString();
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


bookCard.addEventListener('click', async (e) => {
  var button = e.target;
  var bookingId = button.getAttribute("data");
  if (e.target.classList.value === 'confirm') {
    if (confirm('Are you sure you want to confirm?')) {
      try {
        const docRef = doc(colRefListing, bookingId);
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
        const docRef = doc(colRefListing, bookingId);
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
  let y = await fetchBookingData();
  displayListing(y);

});


function toastDisplay(text) {
  let toast = document.getElementById("snackbar");
  // Add the "show" class to DIV
  toast.className = "show";
  toast.innerText = text;
  // After 3 seconds, remove the show class from DIV
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
      userId: addServiceForm.userId.value,
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