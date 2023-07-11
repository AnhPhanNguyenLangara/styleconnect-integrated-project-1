import { showMenu } from './menuStart.js';



import {
    initializeApp
} from 'firebase/app'
import {
    getFirestore,
    collection,
    doc,
    serverTimestamp,
    setDoc
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

// collection ref
const colRef = collection(db, 'professional_profile_v2');
// get UID
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
let currentUserUID = null;

onAuthStateChanged(auth, (user) => {
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
const addProfileForm = document.querySelector('.add')

addProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const newDocRef = doc(colRef);
        await setDoc(newDocRef, {
            customerId: currentUserUID,
            userId: newDocRef.id,
            firstName: addProfileForm.fname.value,
            lastName: addProfileForm.lname.value,
            bio: addProfileForm.bio.value,
            skill: {
                Haircut: addProfileForm.category1.checked,
                Eyelash: addProfileForm.category2.checked,
                Massage: addProfileForm.category3.checked,
                Nail: addProfileForm.category4.checked,
            },
            address1: addProfileForm.address1.value,
            city: addProfileForm.city.value,
            country: addProfileForm.country.value,
            province: addProfileForm.province.value,
            area: {
                downtown: addProfileForm.area1.checked,
                burnaby: addProfileForm.area2.checked,
                richmond: addProfileForm.area3.checked
            },
            photoURL: [addProfileForm.photo.value],
            createdAt: serverTimestamp()
        })
        addProfileForm.reset()
    } catch (error) {
        console.log(error)
    }
})