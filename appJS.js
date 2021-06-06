//current Hour + day in user's location defult display
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

//latest city data update day and time based on user location

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
  return `Latest data update: ${day} ${hours}:${minutes}`;
}

//forecast

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
            <h2><span class="forecastDay" id="forecast-day">${day}</span></h2>
            <h3>
              <span class="dayTempForecast" id="day-temp-forecast">13℃</span
              ><span class="nightTempForecast" id="night-temp-forcast"></span>
                12℃</span
              >
            </h3>
            <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="" class="forecastIcon" id="forecast-icon" width="40px"/>
          </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

displayForecast();

//show current location and current weather in location from button

function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "b5a3097ed58959eb47ee948058cf6636";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function showCurrentCityWeather(response) {
    let currentCity = response.data.name.toUpperCase();
    cityTitle.innerHTML = currentCity.toUpperCase();
    currentDate.innerHTML = formatDate(response.data.dt * 1000);
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
}

function currentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

let currentButton = document.querySelector("button");
currentButton.addEventListener("click", currentLocationWeather);

//CitySearch +display city and current live weather in city

function displayWeather(response) {
  cityTitle.innerHTML = response.data.name.toUpperCase();
  currentDate.innerHTML = formatDate(response.data.dt * 1000);
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
