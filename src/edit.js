const addServiceForm = document.querySelector('.list');
const url =window.location.href;
const searchParams = new URL(url).searchParams;
const entries = new URLSearchParams(searchParams).values();
const array = Array.from(entries);
const obj = JSON.parse(array[0])
addServiceForm.address1.value = obj.address
for (const field in obj) {
    if (addServiceForm[field]) {
      addServiceForm[field].value = obj[field];
    }
  }
addServiceForm.area1.checked = obj.area.downtown;
addServiceForm.area2.checked = obj.area.burnaby;
addServiceForm.area3.checked = obj.area.richmond;
console.log(obj)


import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc, setDoc 
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

// collection ref
const colRef = collection(db, 'professional_profile');
const colRefListing = collection(db, 'pros_listing');
// qureies

// Update doc

addServiceForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    try{
    const docRef = doc(colRefListing,obj.listingId);
    await updateDoc(docRef,{
        address1: addServiceForm.address1.value,
        city: addServiceForm.city.value,
        country: addServiceForm.country.value,
        province: addServiceForm.province.value,
        area: {
            downtown: addServiceForm.area1.checked,
            burnaby: addServiceForm.area2.checked,
            richmond: addServiceForm.area3.checked
        },        
        onlocation:  addServiceForm.onlocation.value,
        onhome:  addServiceForm.onhome.value,
        servicedescription: addServiceForm.servicedescription.value,
        service: addServiceForm.service.value,
        price: +addServiceForm.price.value,
        createdAt: serverTimestamp()
    })
    addServiceForm.reset()}
    catch(error){
        console.log(error);
    }

})
