"use strict";
// ========Elements selection========

// search
const searchInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".btn");

const cityName = document.querySelector(".city-name");
const mainDate = document.querySelector(".main-date");
const feelTemp = document.querySelector(".feels-like-temp");
const mainWeather = document.querySelector(".weather-description");
const mainWeatherImg = document.querySelector(".weather-img");
const mainTemp = document.querySelector(".temp-value");
const humidity = document.querySelector(".humidity-value");
const wind = document.querySelector(".wind-value");
const forecastContainer = document.querySelector(".forecast");

// ========Getting data from API========

async function renderWeather(city) {
  const key = "6bec232055e3f161982b528c34084fba";
  // Geocoding
  const responseGeo = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}
`
  );
  const [dataGeo] = await responseGeo.json();
  const lat = dataGeo.lat;
  const lon = dataGeo.lon;
  console.log(lat, lon);

  //weather data
  const responseWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
  );

  const dataWeather = await responseWeather.json();
  console.log(dataWeather);

  //Updating UI (main section)
  cityName.textContent = dataWeather.name;
  feelTemp.textContent = Math.round(dataWeather.main.feels_like);
  mainWeather.textContent = dataWeather.weather[0].description;
  mainWeatherImg.src = `https://openweathermap.org/img/wn/${dataWeather.weather[0].icon}@2x.png`;
  mainTemp.textContent = Math.round(dataWeather.main.temp);
  humidity.textContent = dataWeather.main.humidity;
  wind.textContent = Math.round(dataWeather.wind.speed * 3.6);

  //   Forecast data

  const responseForecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&cnt=3`
  );

  const dataForecast = await responseForecast.json();
  console.log(dataForecast);

  //Updating UI (forecast section)

  const html = `
  <div class="grid">
    <p class="forecast-date">Thu, Aug 03</p>
        <div class="forecast-temp">
            <img
              class="weather-img-forecast"
              src="http://openweathermap.org/img/wn/09d@2x.png"
              alt=""
            />

            <p class="forecast-temp-range">
              <span class="max-temp">21</span> /
              <span class="min-temp">14</span>
              <span class="forecast-temp-unit">°C</span>
            </p>
        </div>
        <p class="forecast-weather-description">light rain</p>
  </div>`;
}

// ========Event handlers========

function defineCity() {
  const city = searchInput.value;
  renderWeather(city);
  searchInput.value = "";
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  defineCity();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchInput.value) defineCity();
});

// Default City
renderWeather("new york");
