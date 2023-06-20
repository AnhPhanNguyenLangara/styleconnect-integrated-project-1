// Booknow Button

const getBookNow = document.querySelectorAll(".booknow");

getBookNow.forEach((element) => {  //element is the each button for booknow
    element.addEventListener("click", () => {
        window.location.replace("https://www.google.com/");
    })
})
// console.log("click");


