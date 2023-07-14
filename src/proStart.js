import { showMenu } from "./menuStart.js";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
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
    showMenu();
  }
});

//   adding Profile documents
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
      showSuggestions(data.results);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Display autocomplete suggestions
function showSuggestions(suggestions) {
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
  });
}

function showModal() {
  const modal = document.getElementById("image-modal");
  modal.showModal();
}

window.showModal = showModal; //make function available to be called by onClick through webpack

function fromComputer() {
  let input = document.createElement("input");
  input.type = `file`;
  input.accept = `image/*`;
  input.addEventListener("change", function showUploadModal() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      document.getElementById("myimg").src = reader.result;
    };
    document.getElementById("upbtn").addEventListener("click", () => {
      uploadImage(file, `img/${currentUserUID}/profile/`);
    });
    document.getElementById("image-modal").close();
    document.getElementById("upload-modal").showModal();
  });
  input.click();
}

window.fromComputer = fromComputer;

async function uploadImage(file, targetDir) {
  const metaData = {
    contentType: file.type,
  };
  const storage = getStorage();
  const storageRef = sRef(storage, targetDir + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metaData);
  uploadTask.on(
    "state-changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      // setProgresspercent(progress);
      document.getElementById("upprogress").innerHTML = "Upload" + progress + "%";
    },
    (error) => {
      alert(error);
    },
    //using a callback function  if upload is successful
    //using 'then' downloadURL to save the url into the database
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        document.getElementById("image-preview").src=downloadURL;
        document.getElementById("upload-modal").close();
      });
    }
  );
}

window.uploadImage = uploadImage;

addProfileForm.addEventListener("submit", async (e) => {
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
      area: {
        downtown: addProfileForm.area1.checked,
        burnaby: addProfileForm.area2.checked,
        richmond: addProfileForm.area3.checked,
      },
      photoURL: [addProfileForm.photo.value],
      createdAt: serverTimestamp(),
    });
    addProfileForm.reset();
  } catch (error) {
    console.log(error);
  }
});
