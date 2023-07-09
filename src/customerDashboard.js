const ratingSubmit = document.querySelector('#rating-form');
const fetchBooking = document.querySelector('#fetchBooking');
const bookingDetail = document.querySelector('#booking-detail');
const starDialog = document.getElementById("star-dialog");
const confirmBtn = starDialog.querySelector("#confirmBtn");

import {
    initializeApp
} from 'firebase/app'
import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    query,
    where,
    updateDoc,
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
initializeApp(firebaseConfig)
const db = getFirestore();

// collection ref
const colRef = collection(db, 'customer_booking');
const procolRef = collection(db, 'professional_profile_v2');

fetchBooking.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = query(colRef, where('customerId', '==', fetchBooking.userId.value));
    onSnapshot(data, async (snapshot) => {
        bookingDetail.innerHTML = "";
        for (let doc of snapshot.docs) {
            let record = await createRecord(doc);
            bookingDetail.appendChild(record);
        }
    });
});

 async function createRecord(record) {
    const div = document.createElement("div");
    const data = record.data();
    const btn = document.createElement("button");
    btn.innerText = "Rate this service";
    btn.addEventListener("click",()=>{
        starDialog.setAttribute('docId', record.id);
        starDialog.showModal();
    })
    const prosData = await prosFectching(data.prosId);
    const paragraph = document.createElement("paragraph");
    if(data.accepted && isNaN(data.rating)){
        paragraph.textContent = `Available to Rate for ${prosData.firstName} Booking at ${formattedDate} `
    }
    else if(!isNaN(data.rating)){
        const starSpan = document.createElement('span');
        const serviceSpan = document.createElement('span');
        starSpan.textContent = "★"
        serviceSpan.textContent ="for their service"
        starSpan.classList.add('star-span');
        serviceSpan.classList.add('service-span');
        btn.disabled = true;
        console.log(data)
        let timestamp = await data.bookingtime; // Firestore Timestamp
        let date = await timestamp.toDate(); // Convert to JavaScript Date object
        let formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
    date.getDate().toString().padStart(2, '0') + '/' +
    date.getFullYear().toString().substr(-2) + ' TIME:' +
    date.getHours().toString().padStart(2, '0') + ':' +
    date.getMinutes().toString().padStart(2, '0');
        paragraph.textContent = `Booking at ${formattedDate} -- You gave ${prosData.firstName} ${data.rating}`;
        paragraph.appendChild(starSpan);
        paragraph.appendChild(serviceSpan);
    }
    else{
        btn.disabled = true;
        paragraph.textContent = `Waiting confirm from ${prosData.firstName}`
    }
    div.appendChild(paragraph);
    div.prepend(btn);
    return div;
  }
async function prosFectching(prosId){
    const prosTemp = await getDoc(doc(db,'professional_profile_v2', prosId)).then((prosSnap)=>{
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
    if(starDialog.returnValue != 'cancel'){
    const docId = starDialog.getAttribute('docId');
    const docRef = doc(colRef, docId);
    await updateDoc(docRef,{
        rating: starDialog.returnValue
    })
    }
  });
  
  // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
  confirmBtn.addEventListener("click", (event) => {
    event.preventDefault(); // We don't want to submit this fake form
    starDialog.close(confirmBtn.value); // Have to send the select box value here.
  });
