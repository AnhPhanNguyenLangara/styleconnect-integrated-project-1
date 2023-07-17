// Import the firebase default functions from the SDKs
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, query, where, getDocs, getDoc, setDoc, addDoc, onSnapshot, doc
} from 'firebase/firestore';


// setting for accessing database.
const firebaseConfig = {
  apiKey: "AIzaSyD7wzxQRs4mKcMOB0Vcydzdxl0NRtZbXno",
  authDomain: "styleconnect-e781a.firebaseapp.com",
  projectId: "styleconnect-e781a",
  storageBucket: "styleconnect-e781a.appspot.com",
  messagingSenderId: "700825424755",
  appId: "1:700825424755:web:a0fcfadde53d4248912b06",
  measurementId: "G-BW2ZJHSJ2G"
};


// Get the address data from firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Access to the customer_booking collection.
const db = getFirestore(app);
const colRefListing = collection(db, 'customer_booking')
const customerIDs = query(colRefListing, where("customerAddress", "==", true));


//Pick customer's address from booking collection in firebase.
export async function getCustomerAddress() {
  try {
    // get documents from the collection which I want to access.

    const snapShot = await getDocs(customerIDs);
    console.log(snapShot);

    snapShot.forEach((doc) => {
      //get a document from firebase
      const customerData = doc.data();
      const customerAddress = customerData.customerAddress;
      return customerAddress;
      // console.log(customerAddress);
    });
  }
  catch (error) {
    console.error("Error", error);
  }
}


// input & store user address.
// async function addAddress() {
//   // console.log("addAddress called");
//   try {
//     const address = document.getElementById("address").value;
//     // console.log(address);
//     const docRef = await setDoc(colRefListing, {
//       address
//     });
//     // console.log("Data added to Firebase successfully");
//   } catch (error) {
//     console.error("Error. Your infomation has already existed.", error);
//   };
// }