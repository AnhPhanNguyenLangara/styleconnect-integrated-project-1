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
export const app = initializeApp(firebaseConfig);
// Access to the customer_booking collection.
export const db = getFirestore(app);
export const colRefListing = collection(db, 'customer_booking');
export const customerIDs = localStorage.getItem("customerIDs");
export const q = query(colRefListing, where("customerId", "==", customerIDs));

//Pick customer's address from booking collection in firebase.
async function getCustomerAddress() {
  console.log("starting getCustomerAddress function")
  let addressList = [];
  try {
    // get documents from the collection which I want to access.
    console.log("customerIDs",customerIDs);
    const snapShot = await getDocs(q);
    console.log("SHOW SNAPSHOT",snapShot);
    snapShot.docs.forEach( (doc) => {
      //get a document from firebase
      // console.log("doc", doc);  <- Not return anything.
      const customerData = doc.data();
      // console.log("customerData", customerData);  <- Not return anything.
      const customerAddress = customerData.address;
      console.log("customerAddress:", customerAddress);
      addressList.push(customerAddress);
    });
  }
  catch (error) {
    console.error("Error_address pic 2", error);
  }
  return addressList[2];
}

export { getCustomerAddress };

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

