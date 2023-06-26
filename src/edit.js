const addServiceForm = document.querySelector('.list');
const url =window.location.href;
const searchParams = new URL(url).searchParams;
const entries = new URLSearchParams(searchParams).values();
const array = Array.from(entries);
const obj = JSON.parse(array[0])
console.log(addServiceForm)
addServiceForm.onlocation.value = obj.onlocation;
addServiceForm.onhome.value = obj.onhome;
addServiceForm.servicedescription.value = obj.servicedescription;
addServiceForm.service.value = obj.service;
addServiceForm.price.value = obj.price;

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
const colRef = collection(db, 'professional_profile_v2');
const colRefListing = collection(db, 'pros_listing_v2');
// qureies

// Update doc

addServiceForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    try{
    const docRef = doc(colRefListing,obj.listingId);
    await updateDoc(docRef,{     
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
