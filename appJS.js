//current Hour + day defult display
let now = new Date();
let hours = ("0" + now.getHours()).slice(-2);
let minutes = ("0" + now.getMinutes()).slice(-2);

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursady",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let currentDate = document.querySelector("#date");
currentDate.innerHTML = `${day} ${hours}:${minutes}`;

//current day + hour of city after  search

function formatDate(timestamp) {
  let now = new Date(timestamp);
  let hours = ("0" + now.getHours()).slice(-2);
  let minutes = ("0" + now.getMinutes()).slice(-2);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursady",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  return `${day} ${hours}:${minutes}`;
}

//show current location and current weather in location from button

function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function showCurrentCityWeather(response) {
    // currentDate.innerHTML = formatDate(response.data.dt * 1000);
    let currentCity = response.data.name;
    cityTitle.innerHTML = currentCity.toUpperCase();
    let currentLocationTemp = Math.round(response.data.main.temp);
    degreesC.innerHTML = currentLocationTemp;
    celsiusLink.innerHTML = `℃ `;
    fahrenheitLink.innerHTML = `℉`;
    slash.innerHTML = `/`;
    weatherNote.innerHTML = `${response.data.weather[0].description[0].toUpperCase()}${response.data.weather[0].description.slice(
      1
    )}`;
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
}

function currentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

let currentButton = document.querySelector("button");
currentButton.addEventListener("click", currentLocationWeather);

//CitySearch +display city and current live weather in city

function displayWeather(response) {
  // currentDate.innerHTML = formatDate(response.data.dt * 1000);
  cityTitle.innerHTML = response.data.name;
  let temp = Math.round(response.data.main.temp);
  degreesC.innerHTML = temp;
  celsiusLink.innerHTML = `℃ `;
  fahrenheitLink.innerHTML = `℉`;
  slash.innerHTML = `/`;
  weatherNote.innerHTML = `${response.data.weather[0].description[0].toUpperCase()}${response.data.weather[0].description.slice(
    1
  )}`;
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
