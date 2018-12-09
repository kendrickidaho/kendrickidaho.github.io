'use strict';

// Get the query element from the DOM
const QUERY = document.getElementById("query");

// Listen for search entries, get matching locations
QUERY.addEventListener("keyup", function () {
  let searchValue = QUERY.value;
  // Call the processJSON function to request data and build results
  processJSON(searchValue);
}); // ends the eventListener

document.getElementById("searchResults").addEventListener("click", (e) => {
  const key = e.target.dataset['key'];
  console.log(e);
  console.log(e.target);
  console.log(key);

  if (key != null) {
    e.preventDefault();
    getLocationByKey(key);
  }
});

// Request data and build the list of matching locations
function processJSON(searchValue) {
  // Get Data from the Autocomplete API
   const API_KEY = 'wq5DKQugZzjOI0UBCPVVfodQvLNgVXRs';
  let URL = "https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=" + API_KEY + "&q=" + searchValue;
  fetch(URL)
    .then(response => response.json())
    .then(function (data) {
      console.log('Json object from autocomplete API:');
      console.log(data); // Log what is returned

      // Build a list of returned locations
      let list = '<ul>';
      for (let i = 0, n = data.length; i < n; i++) {
        let cityKey = data[i].Key;
        let cityName = data[i].LocalizedName;
        let stateCode = data[i].AdministrativeArea.ID;
        let locationName = cityName + ', ' + stateCode;
        list += "<li><a data-key='" + cityKey + "' href='https://www.accuweather.com/ajax-service/select-city?cityId=" + cityKey + "&lang=en-us' title='See weather information for " + locationName + "' target='_blank'>" + locationName + "</a></li>";
      };
      list += '</ul>';
      // Inject the list to the search page
      let searchResults = document.getElementById("searchResults");
      searchResults.style.display = "block";
      searchResults.innerHTML = list;
    }).catch(error => console.log('There was an error: ', error))
} // ends the processJSON function