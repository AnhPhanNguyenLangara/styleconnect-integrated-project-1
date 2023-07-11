// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, query, where, getDocs, getDoc,setDoc, addDoc, onSnapshot, doc
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
const auth = getAuth();

const addressContainer = document.getElementById('addressContainer');

// to pick up specific User's address and display it.
onAuthStateChanged(auth, async (user)=>{
  if (user) {

    // get a user's ID (dynamic).
    const userId = user.uid;

    // Refer to the specific document and their ID.
    const userRef = doc (colRefListing, userId);
    // console.log(userRef)

    async function displayAddress() {
      try {
        // get documents from the collection which I want to access.
    
        const userDocSnap = await getDoc(userRef);
        const accessAddress = userDocSnap.data().address;
        addressContainer.innerHTML = accessAddress;
    
        // go through every document in the collection
        // querySnap.forEach((document)=> {
        //   // get each address /  .data() method refer to the data which firebase has.
        //   console.log(document.data().address);
        //   document.data()
        // })
      }
      catch(error){
        console.error("error", error);
      }
    }
    await displayAddress();
  } else {
    console.error("error", error);
  }
} )

const displayBtn = document.querySelector("#gbtn");
displayBtn.addEventListener("click", (e)=>{
e.preventDefault();
// console.log(23)
displayAddress();
});

// addEvent listener for subtting 
const storeBtn = document.querySelector(".add");
storeBtn.addEventListener("submit", (e)=>{
e.preventDefault();
addAddress();
});

// input & store user address.
async function addAddress() {
  // console.log("addAddress called");
  try {
    const address = document.getElementById("address").value;
    // console.log(address);
    const docRef = await setDoc(colRefListing, {
      address});
    // console.log("Data added to Firebase successfully");
  } catch (error) {
    console.error("Error. Your infomation has already existed.", error);
  };
}

// const displayBtn = document.querySelector("#gbtn");
// displayBtn.addEventListener("click", (e)=>{
// e.preventDefault();
// // console.log(23)
// displayAddress();
// });

// const addressContainer = document.getElementById('addressContainer');

// //
// async function displayAddress() {
//   try {
//     // get documents from the collection which I want to access.

//     const querySnap = await getDoc(docRef);
//     addressContainer.innerHTML = querySnap.data().address;

//     // go through every document in the collection
//     // querySnap.forEach((document)=> {
//     //   // get each address /  .data() method refer to the data which firebase has.
//     //   console.log(document.data().address);
//     //   document.data()
//     // })
//   }
//   catch(error){
//     console.error("error", error);
//   }
// }



  //   if (docSnap.exists()) {
  //     const data = docSnap.data();

  //     // ドキュメントのアドレスを表示する要素を作成し、テキストを設定する
  //     const addressElement = document.createElement('div');
  //     addressElement.textContent = `Address: ${data.address}`;

  //     // アドレスを表示する要素をコンテナに追加する
  //     addressContainer.appendChild(addressElement);
  //   } else {
  //     console.log('Document does not exist');
  //   }
  // } catch (error) {
  //   console.error('Error displaying address:', error);
  // }

// 特定のドキュメントのアドレスを表示する（例: ドキュメントIDが"exampleDocumentId"の場合）
// displayAddress("exampleDocumentId");


// onSnapshot(colRefListing,(querySnapshot)=>{
//   const total = query
// })
