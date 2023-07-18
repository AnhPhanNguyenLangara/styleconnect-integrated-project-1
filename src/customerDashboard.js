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
  if (user) {
    currentUserUID =user.uid
    // Fetch bookings immediately after user logs in
    fetchBookings(currentUserUID);
  } else {
    // User is signed out
    // Clear out existing bookings
    bookingDetail.innerHTML = "";
    showMenu()
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
    for (let doc of snapshot.docs) {
      let record = await createRecord(doc);
      bookingDetail.appendChild(record);
    }
  });
}

async function createRecord(record) {
  const data = record.data();
  const currentDate = new Date();
  const bookingDate = record.data().bookingtime.toDate();
  const div = document.createElement("div");
  const btn = document.createElement("button");
  const where = data.where === 'onlocation'? 'The professional will service at your location':`You will need to go to the professional's location ${data.address} for the service.`
  
  let formattedDate = await convertDate(bookingDate)
  btn.innerText = "Rate this service";
  btn.addEventListener("click", () => {
    starDialog.setAttribute('docId', record.id);
    starDialog.setAttribute('prosId', record.data().prosId);
    starDialog.showModal();
  })
  const prosData = await prosFectching(data.prosId);
  const paragraph1 = document.createElement("p");
  const paragraph2 = document.createElement("p");
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
    paragraph2.textContent = where;
  }
  div.appendChild(paragraph1);
  div.appendChild(paragraph2);
  div.prepend(btn);
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
