import {
  showMenu
} from "./menuStart.js";

import {
  initializeApp
} from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  getStorage,
  ref as sRef,
  listAll,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD7wzxQRs4mKcMOB0Vcydzdxl0NRtZbXno",
  authDomain: "styleconnect-e781a.firebaseapp.com",
  projectId: "styleconnect-e781a",
  storageBucket: "styleconnect-e781a.appspot.com",
  messagingSenderId: "700825424755",
  appId: "1:700825424755:web:a0fcfadde53d4248912b06",
  measurementId: "G-BW2ZJHSJ2G",
};

// init firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRefListing = collection(db, "pros_listing_v2");
// qureies

// get collection data

// get UID
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(uid)
    // ...
  } else {
    showMenu();
  }
});

const filterForm = document.querySelector(".filter");
const searchResult = document.querySelector("#search-result");
const searchHeader = document.querySelector('#search-header')
let totalResult = 0;

let searchHTML = "";
filterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  searchHTML = "";
  totalResult = 0;
  searchResult.innerHTML = "";
  searchHeader.innerHTML ="";
  let colRef;

  if(filterForm.rating.value == 0) {
    // User does not want to filter by rating
    colRef = query(
      collection(db, "professional_profile_v2"),
      where(`skill.${filterForm.categories.value}`, '==', true),
      where(`area.${filterForm.location.value}`, '==', true)
    );
  } else {
    // User wants to filter by rating
    colRef = query(
      collection(db, "professional_profile_v2"),
      where(`skill.${filterForm.categories.value}`, '==', true),
      where(`area.${filterForm.location.value}`, '==', true),
      where("rating", ">=", +filterForm.rating.value),
    );
  }

  const listingsPromise = getDocs(colRefListing)
    .then((snapshot) => {
      let listings = [];
      snapshot.docs.forEach((x) => {
        listings.push({
          ...x.data(),
          id: x.id
        });
      });
      return listings;
    })
    .catch((err) => {
      console.log(err.message);
    });

  const usersPromise = getDocs(colRef)
    .then((snapshot) => {
      let listings = [];
      console.log(snapshot)
      snapshot.docs.forEach((x) => {
        listings.push({
          ...x.data(),
          listingId: x.id
        });
      });
   
      console.log(listings)
      return listings;
    })
    .catch((err) => {
      console.log(err.message);
    });

  const mergePromise = Promise.all([listingsPromise, usersPromise])
    .then(([listings, users]) => {
      let newArr = users
        .map((user) => {
          let lowestListing = listings.reduce((lowest, listing) => {
            if (
              user.userId === listing.userId &&
              listing.price < (lowest ? lowest.price : Infinity)
            ) {
              return listing;
            }
            return lowest;
          }, null);
          if (lowestListing) {
            // return object with lowest price
            return {
              ...user,
              startPrice: lowestListing.price
            };
          }
        })
        .filter(Boolean);
      return newArr;
    })
    .catch((err) => {
      console.log(err.message);
    });

  displayListing(mergePromise);

})




const displayListing = async (mergePromise) => {
  const storage = getStorage();

  const displayOBJ = await mergePromise;

  const createCard = (x, queryString, downloadURL, ratingShow) => `
      <div class="pros-card">
        <h3>${x.firstName + " " + x.lastName}</h3>
        <h5 class="rating">${ratingShow}<i class="fa-regular fa-star"></i></h5>
        <p class="location">${getObjectKeys(x.area, true)}</p>
        <img src="${downloadURL}" alt="">
        <p class="price">Start from $${x.startPrice}<span>CAD</span></p>
        <a href="booking.html?${queryString}" class="btn btn-show btn-animated">Book Now</a>
      </div>`;
  displayOBJ.forEach((x) => {
   
    let ratingShow = x.rating === undefined ? '' : x.rating
    let obj = {
      userId: x.userId,
      firstName: x.firstName,
      lastName: x.lastName,
      address: x.address1,
      area: x.area,
      bio: x.bio,
      skill: x.skill,
      city: x.city,
      country: x.country,
      startPrice: x.startPrice,
      province: x.province,
      rating: x.rating,
      ratingCount: x.ratingCount,
    };

    const storageRef = sRef(storage, `img/${x.customerId}/profile`);
    console.log(`img/${x.customerId}/profile`);
    let downloadURL = "";
    listAll(storageRef)
      .then(async (res) => {
        const fetchURL = await getDownloadURL(res.items[0]);
        console.log(fetchURL);
        downloadURL = fetchURL;
      })
      .then(() => {
        const searchParams = new URLSearchParams();
        searchParams.append("v1", JSON.stringify(obj));
        let queryString = searchParams.toString();
        searchHTML += createCard(x, queryString, downloadURL, ratingShow);
        totalResult += +1;
      })
      .then(() => {
        searchResult.innerHTML = searchHTML
        searchHeader.innerHTML = `<h2>Search Results</h2>
                                  <h3>Total Results ${totalResult}</h3>`;
      })
      .catch((error) => {
        console.log(error);
        // Uh-oh, an error occurred!
      });
  });
};

function getObjectKeys(obj, value) {
  return Object.keys(obj).filter((key) => obj[key] === value);
}