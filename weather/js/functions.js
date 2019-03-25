// Weather site JavaScript functions 
console.log('My javascript is being read.');




// Variables for Function Use
const temp = 31;
const speed = 5;
buildWC(speed, temp);
const direction = "SE"; //Set your own value
windDial(direction);


// const currentWeather = getcondition("precipitation");
console.log(currentWeather);

function convertToFahrenheit(Celsius) {
   var fahrenheit;
   // Only change code below this line

   fahrenheit = (Celsius * (9 / 5)) + 32;

   // only change code above line
   return fahrenheit;
}

// Calculate the Windchill
function buildWC(speed, temp) {
   const feelTemp = document.getElementById('feels');

   // Compute the windchill
   let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
   console.log(wc);

   // Round the answer down to integer
   wc = Math.floor(wc);

   // If chill is greater than temp, return the temp
   wc = (wc > temp) ? temp : wc;

   // Display the windchill
   console.log(wc);
   wc = 'Feels like ' + wc + '&deg;F';
   feelTemp.innerHTML = wc;
}

// Wind Dial Function
function windDial(direction) {
   // Get the container
   const dial = document.getElementById("dial");
   console.log(direction);
   // Determine the dial class
   switch (direction) {
      case "North":
      case "N":
         dial.setAttribute("class", "n"); //"n" is the CSS rule selector
         break;
      case "NE":
      case "NNE":
      case "ENE":
         dial.setAttribute("class", "ne");
         break;
      case "NW":
      case "NNW":
      case "WNW":
         dial.setAttribute("class", "nw");
         break;
      case "South":
      case "S":
         dial.setAttribute("class", "s");
         break;
      case "SE":
      case "SSE":
      case "ESE":
         dial.setAttribute("class", "se");
         break;
      case "SW":
      case "SSW":
      case "WSW":
         dial.setAttribute("class", "sw");
         break;
      case "East":
      case "E":
         dial.setAttribute("class", "e");
         break;
      case "West":
      case "W":
         dial.setAttribute("class", "w");
         break;
   }
}

function getcondition(weather) {
   if (weather == "sunny" || weather == "clear") {
      return "clear";
   } else if (weather == "rain" || weather == "precipitation") {
      return "rain";
   } else if (weather == "blizzard" || weather == "freezing") {
      return "snow"
   } else if (weather == "overcast" || weather == "dreary") {
      return "clouds"
   } else if (weather == "Dense" || weather == "Hazy") {
      return "fog";
   }
}

// change the summary image
function changeSummaryImage(curCondition) {
   console.log(curCondition);
   // get the current weather container
   const curWeather = document.getElementById("curWeather");

   switch (curCondition) {
      case "Clear":
         curWeather.setAttribute("class", "clear");
         break;
      case "Cloudy":
         curWeather.setAttribute("class", "cloudy");
         break;
      case "Fog":
         curWeather.setAttribute("class", "foggy");
         break;
      case "Rain":
         curWeather.setAttribute("class", "rainy");
         break;
      case "Snow":
         curWeather.setAttribute("class", "snowy");
         break;
   }
}

// statusMessagesetAttribute("class"),"hide";

// Setup localStorage
var storage = window.localStorage;
// Set global variable for custom header required by NWS API
var idHeader = {
   headers: {
      "User-Agent": "Student Learning Project - vil17009@byui.edu"
   }
};

// Populate the current location weather page
function buildPage() {
   // Task 1 - Feed data to WC, Dial, Image, Meters to feet and hourly temps functions
   document.getElementById("elevation").innerHTML = storage.getItem("elevation");
   // Task 2 - Populate location information
   // Task 3 - Populate weather information

    // Task 4 - Hide status and show main
        contentContainer.setAttribute('class', 'main');
        statusMessage.setAttribute('class', 'hide');

        console.log("The build page function is being run");
      }

// Gets location information from the NWS API
function getLocation(locale) {
   const URL = "https://api.weather.gov/points/" + locale;
   // NWS User-Agent header (built above) will be the second parameter 
   fetch(URL, idHeader)
      .then(function (response) {
         if (response.ok) {
            return response.json();
         }
         throw new ERROR('Response not OK.');
      })
      .then(function (data) {
         // Let's see what we got back
         console.log('Json object from getLocation function:');
         console.log(data);
         // Store data to localstorage 
         storage.setItem("locName", data.properties.relativeLocation.properties.city);
         storage.setItem("locState", data.properties.relativeLocation.properties.state);

         // Next, get the weather station ID before requesting current conditions 
         // URL for station list is in the data object 
         let stationsURL = data.properties.observationStations;
         // Call the function to get the list of weather stations
         getStationId(stationsURL);
      })
      .catch(error => console.log('There was a getLocation error: ', error))
} // end getLocation function\\

// Gets weather station list and the nearest weather station ID from the NWS API
function getStationId(stationsURL) {
   // NWS User-Agent header (built above) will be the second parameter 
   fetch(stationsURL, idHeader)
      .then(function (response) {
         if (response.ok) {
            return response.json();
         }
         throw new ERROR('Response not OK.');
      })
      .then(function (data) {
         // Let's see what we got back
         console.log('From getStationId function:');
         console.log(data);

         // Store station ID and elevation (in meters - will need to be converted to feet) 
         let stationId = data.features[0].properties.stationIdentifier;
         let stationElevation = data.features[0].properties.elevation.value;
         console.log('Station and Elevation are: ' + stationId, stationElevation);

         // Store data to localstorage 
         storage.setItem("stationId", stationId);
         storage.setItem("stationElevation", stationElevation);

         // Request the Current Weather for this station 
         getWeather(stationId);
      })
      .catch(error => console.log('There was a getStationId error: ', error))
} // end getStationId function

// Gets current weather information for a specific weather station from the NWS API
function getWeather(stationId) {
   // This is the URL for current observation data 
   const URL = 'https://api.weather.gov/stations/' + stationId + '/observations/latest';
   // NWS User-Agent header (built above) will be the second parameter 
   fetch(URL, idHeader)
      .then(function (response) {
         if (response.ok) {
            return response.json();
         }
         throw new ERROR('Response not OK.');
      })
      .then(function (data) {
         // Let's see what we got back
         console.log('From getWeather function:');
         console.log(data);

         // Store weather information to localStorage 
         storage.setItem("elevation", data.properties.elevation.value);
         let celcius = data.properties.temperature.value
         let fahrenheit = convertToFahrenheit(celcius);

         storage.setItem("temperature", fahrenheit);
         storage.setItem("windDirection", data.properties.windDirection.value);
         storage.setItem("windChill", data.properties.windChill.value);
         storage.setItem("currentWeather", data.properties.textDescription);
         storage.setItem("windSpeed", data.properties.windSpeed);
         const currentWeather = getcondition(data.properties.textDescription);


         // Build the page for viewing 
         buildPage();
      })
      .catch(error => console.log('There was a getWeather error: ', error))
} // end getWeather function