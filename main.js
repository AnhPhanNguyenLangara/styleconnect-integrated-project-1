// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import { getAuth } from "firebase/auth";

import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsUna_z6m9ePH9-k_rlFKkAXTjkmsNJDA",
  authDomain: "styleconnect-1f8c3.firebaseapp.com",
  projectId: "styleconnect-1f8c3",
  storageBucket: "styleconnect-1f8c3.appspot.com",
  messagingSenderId: "413340426931",
  appId: "1:413340426931:web:26408db7b635ecd19a86c6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const auth = getAuth(app);

let ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start("#firebaseui-auth-container", {
//   signInOptions: [
//     {
//       provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
//       requireDisplayName: false,
//     },
//   ],
// });

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "https://google.com",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);
