import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDocs, updateDoc, setDoc 
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
const db =getFirestore();
const colRefListing = collection(db, 'customer_booking');



const bookingTime = document.querySelector('#booking-time');
const fetchListing = document.getElementById('fetchBooking');
async function fetchBookingData() {
    try {
      const queryRef = query(colRefListing, where('prosId', '==', fetchListing.userId.value));
      const snapshot = await getDocs(queryRef);
      let listing = [];
      snapshot.forEach((x) => listing.push(x.data()));
      console.log(listing)
      return listing;
    } catch (err) {
      console.error(err);
    }
  }


fetchListing.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let y = await fetchBookingData();
    console.log(y)
    displayListing(y);
})




const bookCard = document.getElementById('booking-request')
  const displayListing = async (bookingPromise) =>{
    let bookListArr = await bookingPromise;
    console.log(bookingPromise)
    let listingDisplay ="";
    bookListArr.forEach((x)=>{
        let obj ={
            listingId: x.listingId,
            accepted: x.accepted,
            // country: x.country,
            // onhome: x.onhome,
            // onlocation: x.onlocation,
            // servicedescription: x.servicedescription,
            // price: x.price,
            // service: x.service,
        }
        console.log(obj)
        const searchParams = new URLSearchParams();
        searchParams.append('v1', JSON.stringify(obj))

        let queryString =searchParams.toString();
        console.log(queryString)
        listingDisplay += `
        <div class="listing-tab">
        <h4 id="serviceName">Booking-Id: ${x.listingId}</h4>
        ${x.accepted? '<button>RESCHEDULE</button> / <button>CANCEL</button>':'<button class="click">CLICK TO CONFIRM</button>'}
        <a href="editlisting.html?${queryString}" class="btn btn-show btn-animated" id="edit">Edit</a>
        </div>`;
    })
    bookCard.innerHTML =  listingDisplay;
}

 
bookCard.click.addEventListener('click',()=>{
    console.log('test')
 })


