import { showMenu } from "./menuStart.js";

// Single Page for Tab
const listHairLI = document.getElementById("listHairLI");
const listEyeLI = document.getElementById("listEyeLI");
const listMassageLI = document.getElementById("listMassageLI");
const listNailLI = document.getElementById("listNailLI");
const listHair = document.getElementById("listHair");
const listEye = document.getElementById("listEye");
const listMassage = document.getElementById("listMassage");
const listNail = document.getElementById("listNail");

const allLI = [listHairLI, listEyeLI, listMassageLI, listNailLI];
const allpages = [listHair, listEye, listMassage, listNail];

function navigateToPage() {
  const pageId = location.hash ? location.hash : "#listHair";
  for (let i = 0; i < allpages.length; i++) {
    const page = allpages[i];
    const li = allLI[i];

    if (pageId === "#" + page.id) {
      page.style.display = "grid";
      page.classList.add("first-service");
      li.classList.add("active");
    } else {
      page.style.display = "none";
      page.classList.remove("first-service");
      li.classList.remove("active");
    }
  }
}
navigateToPage();
window.addEventListener("hashchange", navigateToPage);

/* For adding profile and service list into firebase */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
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
const colRef = collection(db, "professional_profile_v2");
const colRefListing = collection(db, "pros_listing_v2");
// qureies
const q = query(colRefListing, orderBy("createdAt", "desc"));
// get collection data

// get UID
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

const listingsPromise = getDocs(colRefListing)
  .then((snapshot) => {
    let listings = [];
    snapshot.docs.forEach((x) => {
      listings.push({ ...x.data(), id: x.id });
    });
    return listings;
  })
  .catch((err) => {
    console.log(err.message);
  });

const usersPromise = getDocs(colRef)
  .then((snapshot) => {
    let listings = [];
    snapshot.docs.forEach((x) => {
      listings.push({ ...x.data(), listingId: x.id });
    });
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
          return { ...user, startPrice: lowestListing.price };
        }
      })
      .filter(Boolean);
    return newArr;
  })
  .catch((err) => {
    console.log(err.message);
  });

const displayListing = async () => {
  const storage = getStorage();

  const displayOBJ = await mergePromise;
  let listingDisplay = {
    haircut: "",
    eyelash: "",
    wellness: "",
    nail: "",
  };

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
    let ratingShow = x.rating === undefined? '':x.rating
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

        console.log(downloadURL);
        if (x.skill.Haircut === true) {
          listingDisplay.haircut += createCard(x, queryString, downloadURL, ratingShow);
        }
        if (x.skill.Eyelash === true) {
          listingDisplay.eyelash += createCard(x, queryString, downloadURL, ratingShow);
        }
        if (x.skill.Massage === true) {
          listingDisplay.wellness += createCard(x, queryString, downloadURL, ratingShow);
        }
        if (x.skill.Nail === true) {
          listingDisplay.nail += createCard(x, queryString, downloadURL, ratingShow);
        }
      })
      .then(() => {
        listHair.innerHTML = listingDisplay.haircut;
        listEye.innerHTML = listingDisplay.eyelash;
        listMassage.innerHTML = listingDisplay.wellness;
        listNail.innerHTML = listingDisplay.nail;
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

displayListing();
