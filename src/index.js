/* For adding profile and service list into firebase */


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
const q = query(colRef, orderBy('createdAt', 'desc'))
// get collection data

// getDocs(colRef)
//   .then((snapshot)=> {
//     let books = [];
//     snapshot.docs.forEach((x)=>{
//         books.push({ ...x.data() , id: x.id})
//     })
//     console.log(books)
//   }).catch(err =>{
//     console.log(err.message);
//   })
// real time collection data

onSnapshot(q, (snapshot)=>{
    let prosProfile = [];
    snapshot.docs.forEach((x)=>{
        prosProfile.push({ ...x.data() , id: x.id})
    })
    console.log(prosProfile)
})



//   adding Profile documents
const addProfileForm = document.querySelector('.add')

addProfileForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    try{
    const newDocRef = doc(colRef);
    await setDoc( newDocRef,{
        id: newDocRef.id,
        firstName: addProfileForm.fname.value,
        lastName: addProfileForm.lname.value,
        bio: addProfileForm.bio.value,
        skill: {
            Haircut: addProfileForm.category1.checked,
            Eyelash: addProfileForm.category2.checked,
            Massage: addProfileForm.category3.checked
        },
        photoURL: [addProfileForm.photo.value],
        createdAt: serverTimestamp()
    })
    addProfileForm.reset()}
    catch(error){
        console.log(error)
    }
})
    // addDoc(colRef, {
    //     firstName: addProfileForm.fname.value,
    //     lastName: addProfileForm.lname.value,
    //     bio: addProfileForm.bio.value,
    //     skill: {
    //         Haircut: addProfileForm.category1.checked,
    //         Eyelash: addProfileForm.category2.checked,
    //         Massage: addProfileForm.category3.checked
    //     },
    //     photoURL: [addProfileForm.photo.value],
    //     createdAt: serverTimestamp()
    // })
    // .then(()=>{
    //         console.log(this.id);
    // })
    // .then(()=>{
    //     addProfileForm.reset()
    // })


//   adding service documents
const addServiceForm = document.querySelector('.list');
addServiceForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    try{
    const newDocRef = doc(colRefListing);
    await setDoc(newDocRef,{
        userId: addServiceForm.userId.value,
        listingId: newDocRef.id,
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
        service:  [addServiceForm.service1.value, addServiceForm.service2.value],
        price: [addServiceForm.serviceprice1.value, addServiceForm.serviceprice2.value],
        createdAt: serverTimestamp()
    })
    addServiceForm.reset()}
    catch(error){
        console.log(error);
    }

})


// const deleteBookForm = document.querySelector('.delete')
// deleteBookForm.addEventListener('submit', (e) =>{
//     e.preventDefault();
//     const docRef = doc(db, 'books', deleteBookForm.id.value)
//     deleteDoc(docRef).then(()=>{
//         deleteBookForm.reset();
//     })
// })


// get a single document
// const docRef = doc(db, 'books','KjwOX8iANOItb9tRqAEi')


// onSnapshot(docRef, (doc)=>{
//     console.log(doc.data(), doc.id)
// })



// updating
// const updateForm = document.querySelector('.update')
// updateForm.addEventListener('submit', (e)=>{
//     e.preventDefault();
//     const docRef = doc(db, 'books', updateForm.id.value)
//     updateDoc(docRef,{
//         title: 'updated title'
//     }).then(()=>{
//         updateForm.reset();
//     })
// })

