/* For adding profile and service list into firebase */


import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection,
  query,
  orderBy, getDocs
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
const hairTab = document.getElementById("hairTab");
const eyeTab = document.getElementById("eyeTab");
const massageTab = document.getElementById("massageTab");
const nailTab = document.getElementById("nailTab");
const allpages = [];
allpages.push(hairTab);
allpages.push(eyeTab);
allpages.push(massageTab);
allpages.push(nailTab);

// init firebase
initializeApp(firebaseConfig)

// init services
const db =getFirestore();

// collection ref
const colRef = collection(db, 'professional_profile');
const colRefListing = collection(db, 'pros_listing');
// qureies
const q = query(colRefListing, orderBy('createdAt', 'desc'))
// get collection data
const listservices = document.getElementById('listservices');

const listingsPromise  = getDocs(colRefListing)
  .then((snapshot)=> {
    let listings = [];
    snapshot.docs.forEach((x)=>{
    listings.push({ ...x.data() , id: x.id})})
    return listings
  }).catch(err =>{
    console.log(err.message);
  })
  const usersPromise = getDocs(colRef)
  .then((snapshot)=> {
    let listings = [];
    snapshot.docs.forEach((x)=>{
    listings.push({ ...x.data() , id: x.id})
    })
  return listings
  }).catch(err =>{
    console.log(err.message);
  })

  const mergePromise = Promise.all([listingsPromise, usersPromise])
  .then(([listings, users]) => {
    listings.map((e)=>{
        let temp = users.find(element =>element.id === e.userId)
        if(temp.id){
            e.firstName = temp.firstName;
            e.lastName = temp.lastName;
            e.photoURL = temp.photoURL;
        }
    })
    return listings;
  })
  .catch((err) => {
    console.log(err.message);
  });

  const displayListing = async () =>{
    const displayOBJ = await mergePromise;
    let listingDisplay ="";
    displayOBJ.forEach((x)=>{
       
        listingDisplay += `
        <div class="pros-card">
        <h3>${x.firstName + " " + x.lastName}</h3>
        <i class="fa-regular fa-heart"></i>
        <p class="location">${x.address1+ " " + x.city}</p>
    <img src="${x.photoURL}" alt="">
        <p class="price">${x.price[0]}<span>CAD</span></p>
        <a href="#" class="btn btn-show btn-animated">Book Now</a>
</div>`;
    })
    listservices.innerHTML = listingDisplay;}
  displayListing();