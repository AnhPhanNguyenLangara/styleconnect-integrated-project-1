import {
  showMenu
} from './menuStart.js';

const bookingDetail = document.querySelector('#booking-detail');
const url = window.location.href;
const searchParams = new URL(url).searchParams;
const entries = new URLSearchParams(searchParams).values();
const array = Array.from(entries);
const obj = JSON.parse(array[0])
const fetchId = obj.userId
let ratingShow = obj.rating === undefined? '-':obj.rating
document.getElementById('fullname').textContent = `${obj.firstName} ${obj.lastName}`;
document.getElementById('address').textContent = `${obj.address}`;
document.getElementById('bio').textContent = obj.bio;
document.getElementById('rating').innerHTML += ` ${ratingShow}`;
document.getElementById('ratingCount').textContent = `${obj.ratingCount} reviews`;


import {
  initializeApp
} from 'firebase/app'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
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
const colRefListing = collection(db, 'pros_listing_v2');
const colRefProsProfile = collection(db, 'professional_profile_v2')

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
const auth = getAuth();

let currentUserUID = null;
let prosId = null;
onAuthStateChanged(auth, async (user) => {
  showMenu(user);
  if (user) {
    currentUserUID = user.uid
    let reviews = await getReviews(obj.userId);
    
    // If reviews exist, display them in the modal
    if (reviews.length > 0) {
      let reviewModalContent = document.querySelector('.modal-content');
      reviews.forEach(review => {
        console.log(review)
          let reviewElement = document.createElement('div');
          reviewElement.className = 'review';
          reviewElement.innerHTML = `
              <p><strong>Service:</strong> ${review.serviceName}</p>
              <p><strong>Customer:</strong> ${review.customerFirstName} ${review.customerLastName}</p>
              <p><strong>Rating:</strong> <span class="stars">${'★'.repeat(review.rating)}</span></p>
              <p><strong>Review:</strong> ${review.review}</p>  
          `;
          reviewModalContent.appendChild(reviewElement);
      });
  }
  
  } else {
    // User is signed out
    // ...

  }
});


async function fetchListingData() {
  try {
    const queryRef = query(colRefListing, where('userId', '==', fetchId));
    const snapshot = await getDocs(queryRef);
    let listing = [];
    snapshot.forEach((x) => listing.push(x.data()));
    return listing;
  } catch (err) {
    console.error(err);
  }
}
const fecthLising = await fetchListingData();
const bookingListing = document.querySelector('#booking-listing');
const locationSelect = document.querySelector('#location-select')
fecthLising.forEach((x, index) => {
  // Create a div container

  let container = document.createElement("div");
  container.classList.add("where","listing-container","align-items-center");

  let label = document.createElement("label");
  label.innerHTML = `${x.service} <br> <h3>$ ${x.price} / hour</h3>`;

  let input = document.createElement("input");

  input.type = "checkbox";
  input.classList.add("where","form-check-input")
  input.value = x.listingId;
  input.name = "listing";
  input.checked = index === 0 ? 'checked' : false;


  let dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown")

  let dropdown = document.createElement("select");
  dropdown.classList.add("where","btn","dropdown-toggle","btn-secondary","opacity-75");
  dropdown.setAttribute('service-name', x.service)

  if (x.onhome) {
    let option1 = document.createElement("option");
    option1.value = "onhome";
    option1.text = "On Professional Location";
    dropdown.appendChild(option1);
  }

  if (x.onlocation) {
    let option2 = document.createElement("option");
    option2.value = "onlocation";
    option2.text = "On Your Location";
    dropdown.appendChild(option2);
  }

  // Append the elements to the container
  container.appendChild(label);
  container.appendChild(input);
  // Append the container to the bookingListing element
  bookingListing.prepend(container);


  dropdownContainer.appendChild(dropdown);
  locationSelect.appendChild(dropdownContainer);

});


const bookService = document.querySelector('#book-service');
bookService.addEventListener('click', (e) => {
  let radio = document.getElementsByName('listing');
  if (prosId === obj.userId) {
    e.preventDefault();
    alert('You cannot book your own service');
    return;
  }
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      let dropdown = document.querySelector('.listing-container:nth-child(' + (i + 1) + ') .where');
      let dropdownValue = dropdown.value;
      let serviceName = dropdown.getAttribute('service-name');
      bookService.href = `/dist/bookingConfirm.html?${radio[i].value}?${currentUserUID}?${obj.userId}?${dropdownValue}?${serviceName}`;
    }
  }
});


// Review Modal
let reviewLink = document.querySelector('#review-link');
let reviewModal = document.querySelector('#reviewModal');
let closeModalButton = document.querySelector('.close');

reviewLink.addEventListener('click', function() {
    reviewModal.style.display = 'block';
});

closeModalButton.addEventListener('click', function() {
    reviewModal.style.display = 'none';
});


async function getReviews(prosId) {
  const colRefCustomerBooking = collection(db, 'customer_booking');
  const queryRef = query(colRefCustomerBooking, where('prosId', '==', prosId));
  const snapshot = await getDocs(queryRef);
console.log(prosId)
  let reviews = [];
  snapshot.forEach((doc) => {
    let data = doc.data();
    if(data.rating >0){
    reviews.push({
      serviceName: data.serviceName,
      rating: data.rating,
      customerFirstName: data.customerfirstName,
      customerLastName: data.customerlastName,
      review: data.review
    });
  }
  });
  console.log(reviews)
  return reviews;
}
