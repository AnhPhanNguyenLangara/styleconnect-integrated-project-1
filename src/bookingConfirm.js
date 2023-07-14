import { showMenu } from './menuStart.js';
const bookingDetail = document.querySelector('#booking-detail');
const bookingTime = document.querySelector('#booking-time');
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

const auth = getAuth();
let currentUserUID = null
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
     currentUserUID = user.uid;

    // ...
  } else {
    // User is signed out
    // ...
    showMenu()
  }
});



//   adding Profile documents
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
      customerAddress: customerData.address1,
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