// creating a class user

// class User{
// constructor(fname,lname,province,street,postalcode,phone,email){
//     this.fname = fname;
//     this.lname = lname;
//     this.province = province;
//     this.street = street;
//     this.postalcode = postalcode;
//     this.phone = phone;
//     this.email = email;
// }
// }

// // create an empty array to store the user object 
// let userArray = [];
// //fetching user input
// let fname = document.getElementById('fname').Value;
// let lname = document.getElementById('lname').value;
// let province = document.getElementById('province').Value;
// let street = document.getElementById('street').value;
// let postalcode = document.getElementById('postalcode');
// let phone = document.getElementById('phone').value;
// let email = document.getElementById('email').Value;

// // create an object of the class user
// const user = new User(fname, lname, province, street, postalcode, phone, email)
// userArray.push(user);

// // iterate the data in the arra using for in/ for of loop

// for(elem of userArray){

// }


//file upload starts here
const image_input = document.getElementById('image_input');
const display_image = document.getElementById('display_image');
const form = document.getElementById('form');
let uploaded_image = "";
let files = [];


image_input.addEventListener("change", function() {
    //console.log(image_input.value);
    const reader = new FileReader();
    reader.addEventListener("load", ()=>{
        uploaded_image = reader.result;
        display_image.style.backgroundImage = `url(${uploaded_image})`;
        });
        reader.readAsDataURL(this.files[0]);
})
form.addEventListener("submit", function(e){
    e.preventDefault();
    //select the file that the user wants to upload, then access it using files[0]
   const userFile = image_input.files[0];
   // create a new instance of a special window object called FormData object
   //Reason 1: so that the data selected above can can stored in key value pairs
   //Reason 2: the formdata simplifies the post request, 
   //so we dont have to specify any header or any encoding. 
   //the browser will handle all that once it is kept in the formData
   const formData = new FormData();

   // store the selected dataobject using append.
   // 1. store the userfile
   

   formData.append('userFile', userFile, 'profile.jpg');
// we make post request with fetch with an end point
   fetch('https://httpbin.org/post', {
    method: "POST",
    body:formData,
   })

   //fetch return is a promise, so we handle the result of a promise using .then
   .then(res => res.json())// convert from json to javascript object
   .then(data => console.log(data))// then we log the data into the console
   .catch(err => console.log(err));// throw error message
})