import { showMenu } from "./menuStart.js";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

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

// get UID
const auth = getAuth();
let currentUserUID = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    currentUserUID = user.uid;
    console.log(currentUserUID);
  } else {
    // User is signed out
    showMenu();
    currentUserUID = null;
  }
});

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, "customer_profile");

// adding Profile documents
const addProfileForm = document.querySelector(".add");

const API_KEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";
const addressInput = addProfileForm.address1;
const suggestionsContainer = document.getElementById("suggestions");

// Event listener for input changes
addressInput.addEventListener("input", handleInput);

// Fetch autocomplete suggestions
function handleInput() {
  const inputValue = addressInput.value;
  const autocompleteUrl = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
    inputValue
  )}.json?key=${API_KEY}&limit=5&language=en-US`;
  console.log(autocompleteUrl);
  fetch(autocompleteUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showSuggestions(addressInput, data.results);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Display autocomplete suggestions
function showSuggestions(input, suggestions) {
  suggestionsContainer.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const suggestionElement = document.createElement("div");
    suggestionElement.classList.add("suggestion");
    suggestionElement.textContent = suggestion.address.freeformAddress;

    suggestionElement.addEventListener("click", () => {
      // Handle the selected address
      const selectedAddress = suggestion.address.freeformAddress;
      addressInput.value = selectedAddress;
      suggestionsContainer.innerHTML = "";
    });

    suggestionsContainer.appendChild(suggestionElement);
    input.addEventListener("blur", () => {
      suggestionsContainer.innerHTML = "";
    });
  });
}

addProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    if (currentUserUID) {
      const newDocRef = doc(colRef, currentUserUID);
      await setDoc(newDocRef, {
        userId: currentUserUID,
        firstName: addProfileForm.fname.value,
        lastName: addProfileForm.lname.value,
        phone: addProfileForm.phone.value,
        address1: addProfileForm.address1.value,
        photoURL: [addProfileForm.photo.value],
        createdAt: serverTimestamp(),
      });
      addProfileForm.reset();
    } else {
      console.log("User not signed in");
    }
  } catch (error) {
    console.log(error);
  }
});