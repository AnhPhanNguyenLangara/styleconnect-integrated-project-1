

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


const colRefListing = collection(db, 'pros_listing');
const fetchListing = document.getElementById('fetchListing');
let queryRef;
let prosListArr;

fetchListing.addEventListener('submit', async (e)=>{
    e.preventDefault();
    fetchListingData();
})


async function fetchListingData(){
    queryRef =  query(colRefListing, where('userId', '==', fetchListing.userId.value));
    console.log(queryRef)
    const listingPromise = await getDocs(queryRef).then((snapshot)=>{
        let listing =[]
        snapshot.forEach((x)=>{
            console.log(x.id)
            listing.push(x.data());
        })
        return listing})
        console.log(listingPromise)
        displayListing(listingPromise);
}

// Delete listing records
const deleteListing = document.querySelector('.delete')
deleteListing.addEventListener('submit', (e) =>{
    e.preventDefault();
    const docRef = doc(db, 'pros_listing', deleteListing.id.value)
    console.log(docRef)
    deleteDoc(docRef).then(()=>{
        deleteListing.reset();
    })
})


// Update listing reocrds
const updateListing = document.querySelector('.update')
updateListing.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const docRef =  doc(db, 'pros_listing', updateListing.id.value)
    console.log(docRef)
    await updateDoc(docRef,{
        city: 'Newyork',
        service: [updateListing.service1.value],
        price: [updateListing.serviceprice1.value]
    }).then(()=>{
        updateListing.reset();
    })
})



const startURL = window.location.host;
const listCard = document.getElementById('listing-display')
  const displayListing = async (listingPromise) =>{
    prosListArr = listingPromise;
    let listingDisplay ="";
    prosListArr.forEach((x)=>{
        let obj ={
            listingId: x.listingId,
            address: x.address1,
            city: x.city,
            country: x.country,
            onhome: x.onhome,
            area: {
                downtown: x.area.downtown,
                burnaby: x.area.burnaby,
                richmond: x.area.richmond
            },  
            onlocation: x.onlocation,
            servicedescription: x.servicedescription,
            price: x.price,
            service: x.service,
            province: x.province
        }
        console.log(obj)
        const searchParams = new URLSearchParams();
        searchParams.append('v1', JSON.stringify(obj))
        let queryString =searchParams.toString();
        console.log(queryString)
        listingDisplay += `
        <div class="listing-tab">
        <h3 id="serviceName">Service: ${x.service}</h3>
        <p id="servicePrice">Price: ${x.price}</p>
        <a href="editlisting.html?${queryString}" class="btn btn-show btn-animated" id="edit">Edit</a>
        </div>`;
    })
    listCard.innerHTML =  listingDisplay;
}

 
