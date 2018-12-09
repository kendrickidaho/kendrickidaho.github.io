// Weather site JavaScript functions 
console.log('My javascript is being read.');

// Variables for Function Use
// const temp = 31;
// const speed = 5;
buildWC(speed, temp);
const direction = "E"; //Set your own value
windDial(direction);


const currentWeather = getcondition("precipitation");
console.log(currentWeather);


 // Calculate the Windchill
 function buildWC(speed, temp) {
    const feelTemp = document.getElementById('feels');
   
    // Compute the windchill
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);
   
    // Round the answer down to integer
    wc = Math.floor(wc);
   
    // If chill is greater than temp, return the temp
    wc = (wc > temp)?temp:wc;
   
    // Display the windchill
    console.log(wc);
    // wc = 'Feels like '+wc+'°F';
    feelTemp.innerHTML = wc;
    }

    // Wind Dial Function
function windDial(direction){
   // Get the container
   const dial = document.getElementById("dial");
   console.log(direction);
   // Determine the dial class
   switch (direction){
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

function getcondition(weather){
   if(weather == "sunny" || weather == "clear"){
      return "clear";
   }
   else if (weather == "rain" || weather == "precipitation") {
      return "rain";
   }
   else if(weather == "blizzard" || weather == "freezing") {
      return "snow"
   }
   else if (weather == "overcast"|| weather == "dreary"){
      return "clouds"
   }
   else if (weather == "Dense"|| weather =="Hazy"){
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


   // Get location code from API
function getCode(LOCALE) {
    const API_KEY = 'wq5DKQugZzjOI0UBCPVVfodQvLNgVXRs';
    const URL = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey='+API_KEY+'&q='+LOCALE;
    fetch(URL)
     .then(response => response.json())
     .then(function (data) {
      console.log('Json object from getCode function:');
      console.log(data);
      const locData = {}; // Create an empty object
      locData['key'] = data.Key; // Add the value to the object
      locData['name'] = data.LocalizedName;
      locData['postal'] = data.PrimaryPostalCode;
      locData['state'] = data.AdministrativeArea.LocalizedName;
      locData['stateAbbr'] = data.AdministrativeArea.ID;
      locData['geoposition'] = LOCALE;
      locData['elevation'] = data.GeoPosition.Elevation.Imperial.Value;
      getWeather(locData);
      })
     .catch(error => console.log('There was a getCode error: ', error))
  } // end getCode function

  // Get Current Weather data from API
function getWeather(locData) {
    const API_KEY = 'wq5DKQugZzjOI0UBCPVVfodQvLNgVXRs';
    const CITY_CODE = locData['key']; // We're getting data out of the object
    const URL = "https://dataservice.accuweather.com/currentconditions/v1/"+CITY_CODE+"?apikey="+API_KEY+"&details=true";
    fetch(URL)
     .then(response => response.json())
     .then(function (data) {
      console.log('Json object from getWeather function:');
      console.log(data); // Let's see what we got back
      // Start collecting data and storing it
      locData['currentTemp'] = data[0].Temperature.Imperial.Value;
      locData['summary'] = data[0].WeatherText;
      locData['windSpeed'] = data[0].Wind.Speed.Imperial.Value;
      locData['windUnit'] = data[0].Wind.Speed.Imperial.Unit;
      locData['windDirection'] = data[0].Wind.Direction.Localized;
      locData['windGust'] = data[0].WindGust.Speed.Imperial.Value;
      locData['pastLow'] = data[0].TemperatureSummary.Past12HourRange.Minimum.Imperial.Value;
      locData['pastHigh'] = data[0].TemperatureSummary.Past12HourRange.Maximum.Imperial.Value;
      getHourly(locData); // Send data to getHourly function
      })
     .catch(error => console.log('There was an error: ', error))
  } // end getWeather function

  // Get next 12 hours of forecast data from API
function getHourly(locData) {
    const API_KEY = 'wq5DKQugZzjOI0UBCPVVfodQvLNgVXRs';
    const CITY_CODE = locData['key'];
    const URL = "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+CITY_CODE+"?apikey="+API_KEY;
    fetch(URL)
      .then(response => response.json())
      .then(function (data) {
      console.log('Json object from getHourly function:');
      console.log(data); // See what we got back
      // Get the first hour in the returned data
      let date_obj = new Date(data[0].DateTime);
      let nextHour = date_obj.getHours(); // returns 0 to 23
      // Store into the object
      locData["nextHour"] = nextHour;
      // Counter for the forecast hourly temps
      var i = 1;
      // Get the temps for the next 12 hours
      data.forEach(function (element) {
        let temp = element.Temperature.Value;
        let hour = 'hourTemp' + i;
        locData[hour] = temp; // Store hour and temp to object
        // New hiTemp variable, assign value from previous 12 hours
        let hiTemp = locData.pastHigh;
        // New lowTemp variable, assign value from previous 12 hours
        let lowTemp = locData.pastLow;
        // Check current forecast temp to see if it is 
        // higher or lower than previous hi or low
        if(temp > hiTemp){
          hiTemp = temp;
        } else if (temp < lowTemp){
          lowTemp = temp;
        }
        // Replace stored low hi and low temps if they changed
        if(hiTemp != locData.pastHigh){
          locData["pastHigh"] = hiTemp; // When done, this is today's high temp
        }
        if(lowTemp != locData.pastLow){
          locData["pastLow"] = lowTemp; // When done, this is today's low temp
        }
        i++; // Increase the counter by 1
      }); // ends the foreach method
      console.log('Finished locData object and data:');
      console.log(locData);
      buildPage(locData); // Send data to buildPage function
      })
      .catch(error => console.log('There was an error: ', error))
  } // end getHourly function

  function buildPage(locData){
    document.getElementById("state").innerHTML = locData['state'];
    document.getElementById("city").innerHTML = locData['name'];
    document.getElementById("zipcode").innerHTML = locData["postal"];
    document.getElementById("elevation").innerHTML = locData["elevation"];
    document.getElementById("latlong").innerHTML = locData["geoposition"];
    document.getElementById("temp1").innerHTML = locData["currentTemp"];
    document.getElementById("tempHigh").innerHTML = locData["pastHigh"];
    document.getElementById("tempLow").innerHTML = locData["pastLow"];
    document.getElementById("tempFl").innerHTML = locData["feelsLike"];
    document.getElementById("windSpeed").innerHTML = locData["WindSpeed"];
    document.getElementById("windDirec").innerHTML = locData["windDirection"];
    document.getElementById("hourly").innerHTML = locData["hourly"];
  }

  // Get location info, based on city key, from API
// function getLocationByKey(cityKey) {
//    const API_KEY = 'wq5DKQugZzjOI0UBCPVVfodQvLNgVXRs';
//    const URL = 'https://dataservice.accuweather.com/locations/v1/'+cityKey+'?apikey='+API_KEY;
//    fetch(URL)
//     .then(response => response.json())
//     .then(function (data) {
//      console.log('Json object from getLocationByKey function:');
//      console.log(data);
//      const locData = {}; // Create an empty object
//      locData['key'] = data.Key; // Add the value to the object
//      locData['city'] = data.LocalizedName;
//      locData['zipcode'] = data.PrimaryPostalCode;
//      locData['state'] = data.AdministrativeArea.LocalizedName;
//      locData['stateAbbr'] = data.AdministrativeArea.ID;
//      let lat = data.GeoPosition.Latitude;
//      let long = data.GeoPosition.Longitude;
//      const LOCALE = lat+', '+long;
//      locData['geoposition'] = LOCALE;
//      locData['elevation'] = data.GeoPosition.Elevation.Imperial.Value;
//      getWeather(locData);
//      })
//     .catch(error => console.log('There was a getLocationByKey error: ', error));
//    }