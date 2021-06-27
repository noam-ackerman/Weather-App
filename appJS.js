//general selectors
let noteDate = document.querySelector("#note-date");
let iconElement = document.querySelector("#icon");
let slash = document.querySelector("#slash");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");
let extraDetails = document.querySelector("#extra-details");
let cityTitle = document.querySelector("#city-title");
let weatherNote = document.querySelector("#note");
let degreesC = document.querySelector("#degrees-c");
let degreesF = document.querySelector("#degrees-f");

//current Hour + day in user's location defult display
let now = new Date();
let hours = ("0" + now.getHours()).slice(-2);
let minutes = ("0" + now.getMinutes()).slice(-2);
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let currentDate = document.querySelector("#date");
currentDate.innerHTML = `${day} ${hours}:${minutes}`;

//latest city data update day and time based on location timezone
function formatLocalTime(props) {
  let localTime = new Date(props.dt * 1000);
  let localTimeOffset = localTime.getTimezoneOffset() * 60;
  localTime.setSeconds(
    localTime.getSeconds() + localTimeOffset + props.timezone
  );
  let localHours = ("0" + localTime.getHours()).slice(-2);
  let localMinutes = ("0" + localTime.getMinutes()).slice(-2);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let localDay = days[localTime.getDay()];

  return `${localDay} ${localHours}:${localMinutes}`;
}

//display forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    let tempMax = Math.round(forecastDay.temp.max);
    let tempMin = Math.round(forecastDay.temp.min);
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <h2><div class="forecastDay" id="forecast-day">${formatDay(
              forecastDay.dt
            )}</div></h2>
            <h3>
              <strong><span class="maxTempForecast" id="max-temp-forecast">${tempMax}</span><span>°</span></strong>
              <br/>
              <span class="minTempForecast" id="min-temp-forecast">${tempMin}</span><span>°</span>
            </h3>
            <img src="icons/${forecastDay.weather[0].icon}.png" alt="${
          forecastDay.weather[0].description
        }" class="forecastIcon" id="forecast-icon" width="28px"/>
          </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//fahrenheit + back to Celsius conversion main current temp and forecast
//fahrenheit conversion
function changeToFahrenheit(event) {
  event.preventDefault();
  //main temp
  let temp = degreesC.innerHTML;
  let fahrenheit = Math.round((temp * 9) / 5 + 32);
  degreesF.innerHTML = `${fahrenheit}`;
  degreesC.innerHTML = ``;
  //forecast max temp
  let maxTempForecast = document.querySelectorAll("#max-temp-forecast");
  maxTempForecast.forEach(function (item) {
    let maxCTemp = item.innerHTML;
    item.innerHTML = Math.round((maxCTemp * 9) / 5 + 32);
  });
  //forecast min temp
  let minTempForecast = document.querySelectorAll("#min-temp-forecast");
  minTempForecast.forEach(function (item) {
    let minCTemp = item.innerHTML;
    item.innerHTML = Math.round((minCTemp * 9) / 5 + 32);
  });
  //to prevent double conversion
  fahrenheitLink.removeEventListener("click", changeToFahrenheit);
  celsiusLink.addEventListener("click", changeToCelsius);
}
// back to celsius conversion
function changeToCelsius(event) {
  event.preventDefault();
  //main temp
  let temp = degreesF.innerHTML;
  degreesC.innerHTML = Math.round(((temp - 32) * 5) / 9);
  degreesF.innerHTML = ``;
  //forecast max temp
  let maxTempForecast = document.querySelectorAll("#max-temp-forecast");
  maxTempForecast.forEach(function (item) {
    let maxFTemp = item.innerHTML;
    item.innerHTML = Math.round(((maxFTemp - 32) * 5) / 9);
  });
  // forecast min Temp
  let minTempForecast = document.querySelectorAll("#min-temp-forecast");
  minTempForecast.forEach(function (item) {
    let minFTemp = item.innerHTML;
    item.innerHTML = Math.round(((minFTemp - 32) * 5) / 9);
  });
  //to prevent double conversion
  celsiusLink.removeEventListener("click", changeToCelsius);
  fahrenheitLink.addEventListener("click", changeToFahrenheit);
}

//dispaly weather + city + getting coords for forecast
function getCoords(coordinates) {
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  cityTitle.innerHTML = response.data.name.toUpperCase();
  iconElement.setAttribute("src", `icons/${response.data.weather[0].icon}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let temp = Math.round(response.data.main.temp);
  degreesC.innerHTML = temp;
  degreesF.innerHTML = "";
  celsiusLink.innerHTML = `°C`;
  fahrenheitLink.innerHTML = `°F`;
  slash.innerHTML = `/`;
  let currentDate = document.querySelector("#date");
  noteDate.innerHTML = "Latest data update in local timezone:";
  currentDate.innerHTML = formatLocalTime(response.data);
  weatherNote.innerHTML = response.data.weather[0].description;
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = Math.round(response.data.main.humidity);
  extraDetails.innerHTML = `Humidity: ${humidity}% <strong>•</strong> Wind: ${windSpeed} km/h`;
  getCoords(response.data.coord);
}

//get current location and current weather in location from button
function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function currentLocationWeather(event) {
  event.preventDefault();
  // reset conversion
  celsiusLink.removeEventListener("click", changeToCelsius);
  fahrenheitLink.addEventListener("click", changeToFahrenheit);
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

let currentButton = document.querySelector("button");
currentButton.addEventListener("click", currentLocationWeather);

//City Search engine
function search(city) {
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function submit(event) {
  event.preventDefault();
  // reset conversion
  celsiusLink.removeEventListener("click", changeToCelsius);
  fahrenheitLink.addEventListener("click", changeToFahrenheit);
  let cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", submit);
