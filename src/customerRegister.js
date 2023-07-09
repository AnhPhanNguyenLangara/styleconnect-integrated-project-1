/* For adding profile and service list into firebase */


import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  doc, query, orderBy, serverTimestamp, setDoc 
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
const colRef = collection(db, 'customer_profile');


//   adding Profile documents
const addProfileForm = document.querySelector('.add')

addProfileForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    try{
    const newDocRef = doc(colRef);
    await setDoc( newDocRef,{
        userId: newDocRef.id,
        firstName: addProfileForm.fname.value,
        lastName: addProfileForm.lname.value,
        phone: addProfileForm.phone.value,
        address1: addProfileForm.address1.value,
        photoURL: [addProfileForm.photo.value],
        createdAt: serverTimestamp()
    })
    addProfileForm.reset()}
    catch(error){
        console.log(error)
    }
})


