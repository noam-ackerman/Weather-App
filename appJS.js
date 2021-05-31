//Date
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

//show current location and current weather in location from button

function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function showCurrentCityWeather(response) {
    let currentCity = response.data.name;
    cityTitle.innerHTML = currentCity.toUpperCase();
    let currentTemp = Math.round(response.data.main.temp);
    currentTempC.innerHTML = currentTemp;
    weatherNote.innerHTML = `${response.data.weather[0].description[0].toUpperCase()}${response.data.weather[0].description.slice(
      1
    )}`;
    let windSpeed = Math.round(response.data.wind.speed);
    let humidity = Math.round(response.data.main.humidity);
    extraDetails.innerHTML = `Humidity: ${humidity}% • Wind: ${windSpeed} km/h`;
    let currentFahrenheitDegrees = document.querySelector("#fahrenheit-link");
    currentFahrenheitDegrees.addEventListener(
      "click",
      function changeToCurrentFahrenheit(event) {
        event.preventDefault();
        let fahrenheit = Math.round((currentTemp * 9) / 5 + 32);
        currentTempF.innerHTML = `${fahrenheit}`;
        currentTempC.innerHTML = ``;
      }
    );
    let currentCelsiusDegrees = document.querySelector("#celsius-link");
    currentCelsiusDegrees.addEventListener(
      "click",
      function changeToCurrentCelsius(event) {
        event.preventDefault();
        currentTempC.innerHTML = currentTemp;
        currentTempF.innerHTML = ``;
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
  let temp = Math.round(response.data.main.temp);
  currentTempC.innerHTML = temp;
  weatherNote.innerHTML = `${response.data.weather[0].description[0].toUpperCase()}${response.data.weather[0].description.slice(
    1
  )}`;
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = Math.round(response.data.main.humidity);
  extraDetails.innerHTML = `Humidity: ${humidity}% • Wind: ${windSpeed} km/h`;
  let fahrenheitDegrees = document.querySelector("#fahrenheit-link");
  fahrenheitDegrees.addEventListener(
    "click",
    function changeToFahrenheit(event) {
      event.preventDefault();
      let fahrenheit = Math.round((temp * 9) / 5 + 32);
      currentTempF.innerHTML = `${fahrenheit}`;
      currentTempC.innerHTML = ``;
    }
  );
  let celsiusDegrees = document.querySelector("#celsius-link");
  celsiusDegrees.addEventListener("click", function changeToCelsius(event) {
    event.preventDefault();
    currentTempC.innerHTML = temp;
    currentTempF.innerHTML = ``;
  });
}

function showCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let cityInputValue = cityInput.value;
  cityTitle.innerHTML = cityInputValue.toUpperCase();
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInputValue}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", showCity);

//selectors

let extraDetails = document.querySelector("#extra-details");
let cityTitle = document.querySelector("#city-title");
let weatherNote = document.querySelector("#note");
let currentTempC = document.querySelector("#current-degrees-c");
let currentTempF = document.querySelector("#current-degrees-f");
