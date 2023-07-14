const addressInput = document.getElementById("addressInput");
const suggestionContainer = document.getElementById("suggestionContainer");
const APIKEY = "ebSKGOKaTk6WTADs40LNnaFX4X7lKlqG";
// const submitAddress = document.getElementById("submitAddress")


// EventListener to show the address when user input something.
addEventListener("input", getSuggestion)

// input address and get suggestions
function getSuggestion() {
    const inputValue = addressInput.value;
    const autoCompleteURL = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
        inputValue
    )}.json?key=${APIKEY}&limit=7&language=en-US`;
    console.log(autoCompleteURL);

    fetch(autoCompleteURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // data.results contains candidate of address.
            showSuggestions(data.results);
        })
        .catch(error => {
            console.error("Error:", error);
        })
}

// show suggestion

// suggestions is a parameter. suggestions parameter are each data of "data.result"
function showSuggestions(suggestions) {

    // create elements to show the candidate
    suggestionContainer.innerHTML = "";
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement("div");
        suggestionElement.classList.add("suggestion");
        // full address of each data.result = suggestion.address.freeformAddress
        suggestionElement.textContent = suggestion.address.freeformAddress;

        // click & select the address from an element.
        suggestionElement.addEventListener("click", () => {
            const selectedAddress = suggestion.address.freeformAddress;
            addressInput.value = selectedAddress;
            suggestionContainer.innerHTML = "";
        });
        suggestionContainer.appendChild(suggestionElement);
    })
}