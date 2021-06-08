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

//latest city data update day and time based on user location

function formatLocalTime(props) {
  let localTime = new Date(props.dt * 1000);
  let localTimeOffset = localTime.getTimezoneOffset() * 60;
  localTime.setSeconds(
    localTime.getSeconds() + localTimeOffset + props.timezone
  );
  let localHours = ("0" + localTime.getHours()).slice(-2);
  let localMinutes = ("0" + localTime.getMinutes()).slice(-2);

  return `${localHours}:${localMinutes}`;
}

function formatLocalDate(props) {
  let localTime = new Date(props.dt * 1000);
  let localTimeOffset = localTime.getTimezoneOffset() * 60;
  localTime.setSeconds(
    localTime.getSeconds() + localTimeOffset + props.timezone
  );
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
  return `${localDay} ${formatLocalTime(props)} `;
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
              <div class="maxTempForecast" id="max-temp-forecast">${tempMax}℃</div>
              <div class="minTempForecast" id="min-temp-forecast">${tempMin}℃</div>
            </h3>
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="${
          forecastDay.weather[0].description
        }" class="forecastIcon" id="forecast-icon" width="35px"/>
          </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//show current location and current weather in location from button

function getCurrentLocationForcast(coordinates) {
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function showCurrentCityWeather(response) {
    let currentCity = response.data.name.toUpperCase();
    let noteDate = document.querySelector("#note-date");
    let currentDate = document.querySelector("#date");
    noteDate.innerHTML = "Latest data update in local timezone:";
    currentDate.innerHTML = formatLocalDate(response.data);
    cityTitle.innerHTML = currentCity.toUpperCase();
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
    let currentLocationTemp = Math.round(response.data.main.temp);
    degreesC.innerHTML = currentLocationTemp;
    celsiusLink.innerHTML = `°C`;
    fahrenheitLink.innerHTML = `°F`;
    slash.innerHTML = `/`;
    weatherNote.innerHTML = response.data.weather[0].description;
    let windSpeed = Math.round(response.data.wind.speed);
    let humidity = Math.round(response.data.main.humidity);
    extraDetails.innerHTML = `Humidity: ${humidity}% <strong>•</strong> Wind: ${windSpeed} km/h`;
    fahrenheitLink.addEventListener(
      "click",
      function changeToCurrentFahrenheit(event) {
        event.preventDefault();
        let fahrenheit = Math.round((currentLocationTemp * 9) / 5 + 32);
        degreesF.innerHTML = `${fahrenheit}`;
        degreesC.innerHTML = ``;
      }
    );
    celsiusLink.addEventListener(
      "click",
      function changeToCurrentCelsius(event) {
        event.preventDefault();
        degreesC.innerHTML = currentLocationTemp;
        degreesF.innerHTML = ``;
      }
    );
  });
  getCurrentLocationForcast(position.coords);
}

function currentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

let currentButton = document.querySelector("button");
currentButton.addEventListener("click", currentLocationWeather);

//CitySearch +display city and current live weather in city

function getCoords(coordinates) {
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  cityTitle.innerHTML = response.data.name.toUpperCase();
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let temp = Math.round(response.data.main.temp);
  degreesC.innerHTML = temp;
  celsiusLink.innerHTML = `°C`;
  fahrenheitLink.innerHTML = `°F`;
  slash.innerHTML = `/`;
  let noteDate = document.querySelector("#note-date");
  let currentDate = document.querySelector("#date");
  noteDate.innerHTML = "Latest data update in local timezone:";
  currentDate.innerHTML = formatLocalDate(response.data);
  weatherNote.innerHTML = response.data.weather[0].description;
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = Math.round(response.data.main.humidity);
  extraDetails.innerHTML = `Humidity: ${humidity}% <strong>•</strong> Wind: ${windSpeed} km/h`;
  fahrenheitLink.addEventListener("click", function changeToFahrenheit(event) {
    event.preventDefault();
    let fahrenheit = Math.round((temp * 9) / 5 + 32);
    degreesF.innerHTML = `${fahrenheit}`;
    degreesC.innerHTML = ``;
  });
  celsiusLink.addEventListener("click", function changeToCelsius(event) {
    event.preventDefault();
    degreesC.innerHTML = temp;
    degreesF.innerHTML = ``;
  });

  getCoords(response.data.coord);
}

function search(city) {
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function submit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", submit);

//selectors
let iconElement = document.querySelector("#icon");
let slash = document.querySelector("#slash");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");
let extraDetails = document.querySelector("#extra-details");
let cityTitle = document.querySelector("#city-title");
let weatherNote = document.querySelector("#note");
let degreesC = document.querySelector("#degrees-c");
let degreesF = document.querySelector("#degrees-f");
