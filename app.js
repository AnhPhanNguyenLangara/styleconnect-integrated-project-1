      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries

      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyCFC2okFyDTiP_dRwubXFFK7efZULCYFNQ",
        authDomain: "upload2-25d7c.firebaseapp.com",
        projectId: "upload2-25d7c",
        storageBucket: "upload2-25d7c.appspot.com",
        messagingSenderId: "169491321843",
        appId: "1:169491321843:web:63f8814aafabf2726bb886"
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      //import library to access firebase storage with getStorage, ref and other functions 
      import { getStorage, ref, uploadBytes, getDownloadURL }
        from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js"
const storage = getStorage(app);
      import { getFirestore, doc, getDoc, setDoc, collection }
        from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"
      const clouddb = getFirestore();
      
// console.log(firebase);
// related to camera and picture

const snap = document.getElementById("snap");
const video = document.getElementById('video');

// Elements for taking the snapshot
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.scale(0.5, 0.5);

document.getElementById("start").addEventListener("click", function () {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true })
    .then( (stream) => {
      video.srcObject = stream;
      // video.play();  // or autplay
    }).catch( (error) => {
        console.log("failed to get media stream", error);
    });

  } else {
    console.log("media devices not available in this browser");
  }
  function pics(){
    //canvas.width = video.videoWidth; 
    //canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0,);
  let imgBase64 = canvas.toDataURL('image/png');
    document.getElementById("image").value = imgBase64;
  
    //alternatively
    //const imageBlob = canvas.toBlob(handleBlob, 'image/jpeg');
  };
  
//upload image
let button = document.getElementById('button')
button.addEventListener('click', function(){
   context.drawImage(video,0,0,640,480);
   let image = new Image();
   image.id = 'pic';
   image.src = canvas.toDataURL('image/png');
   console.log(image.src);
   let blob = canvas.toDataURL('image/jpg');
   const vref = ref(storage,'picture2.jpg');
    uploadBytes(vref, blob) 
    .then(function(snapshot) {
      console.log('Uploaded!');
    });
  //  let test=new Image();
  //   test.src = blob;
    document.getElementById("test").value = blob;
  //  vref.putString(image.src, 'base64').then(function(snapshot) {
  //   console.log('Uploaded a base64 string!');
  // });
    // const clouddb = getFirestore();

    // clouddb.child(new date() + '-' + 'base64').putString(image.src,'data_url')
    // .then(function(snapshot){
    //     console.log("image uploaded")
    // })

})

//   button.onclick = function(){
    
//     // 
// }
pics();
});

// Trigger photo take

// snap.addEventListener("click", pics);
document.getElementById("stop").addEventListener("click",  () => {
  const tracks = video.srcObject.getTracks();
  tracks.forEach(track => track.stop());
});


