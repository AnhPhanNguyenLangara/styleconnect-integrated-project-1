// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, query, where, getDocs, setDocs
} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7wzxQRs4mKcMOB0Vcydzdxl0NRtZbXno",
  authDomain: "styleconnect-e781a.firebaseapp.com",
  projectId: "styleconnect-e781a",
  storageBucket: "styleconnect-e781a.appspot.com",
  messagingSenderId: "700825424755",
  appId: "1:700825424755:web:a0fcfadde53d4248912b06",
  measurementId: "G-BW2ZJHSJ2G"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// console.log(app);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const colRefListing = collection(db, 'kimi_test')
//

console.log()
const storeAdd = document.querySelector(".add");
storeAdd.addEventListener("submit", (e)=>{
e.preventDefault();
addAddress();

});
// console.log(colRefListing)
// console.log("ssss")

async function addAddress() {
  console.log("addAddress called")
}



// todoForm.addEventListener('submit', addTodo); //benefits from validation

// async function addTodo() {
//   console.log('addTodo called');
//   let todoName = document.getElementById('name').value;
//   let dueValue = document.getElementById('due').value;
//   // use firestore API to add a document to DB_NAME collection //
//   try {
//     const docRef = await addDoc( collection( db , DB_NAME ) , { todoName , dueValue} );
//     console.log(docRef);
//   } catch(error){
//     console.log(error);
//   }