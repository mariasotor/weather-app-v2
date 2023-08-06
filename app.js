"use strict";
// ========Elements selection========

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

// ==== Forecast date formatting ====

function formatForecastDate(timestamp) {
  const date = new Date(timestamp);

  const day = `${date.getDate()}`.padStart(2, 0);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekday = weekdays[date.getDay()];

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];

  const dateStr = `${weekday}, ${month} ${day}`;
  return dateStr;
}

// ==Getting data from API and DOM manipulation==

async function renderWeather(city) {
  // Format main section date
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[now.getMonth()];
  const hour = `${now.getHours()}`.padStart(2, 0);
  const minutes = `${now.getMinutes()}`.padStart(2, 0);

  const dateNTime = `${month} ${day}, ${hour}:${minutes}`;

  // Geocoding
  const responseGeo = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=6bec232055e3f161982b528c34084fba
`
  );
  const [dataGeo] = await responseGeo.json();
  const lat = dataGeo.lat;
  const lon = dataGeo.lon;

  // Current weather data
  const key = "a1921bd56aaa472aba50748fba60247c";

  const responseWeather = await fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${key}`
  );

  const { data } = await responseWeather.json();
  const [dataWeather] = data;
  console.log(dataWeather);

  // Update UI (main section)
  mainDate.textContent = dateNTime;
  cityName.textContent = dataWeather.city_name;
  feelTemp.textContent = Math.round(dataWeather.app_temp);
  mainWeather.textContent = dataWeather.weather.description;
  mainWeatherImg.src = `https://cdn.weatherbit.io/static/img/icons/${dataWeather.weather.icon}.png`;
  mainWeatherImg.alt = dataWeather.weather.description;
  mainTemp.textContent = Math.round(dataWeather.temp);
  humidity.textContent = dataWeather.rh;
  wind.textContent = Math.round(dataWeather.wind_spd * 3.6);

  // Forecast data
  const responseForecast = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}&days=5`
  );

  const { data: dataForecast } = await responseForecast.json();
  console.log(dataForecast[0]);

  // Update UI (forecast data)

  let html;

  dataForecast.forEach((day) => {
    html = `
  
    <p class="forecast-date">${formatForecastDate(day.ts * 1000)}</p>
        <div class="forecast-temp">
            <img
              class="weather-img-forecast"
              src="https://cdn.weatherbit.io/static/img/icons/${
                day.weather.icon
              }.png"
              alt=${day.weather.description}
            />

            <p class="forecast-temp-range">
              <span class="max-temp">${Math.round(day.max_temp)}</span> /
              <span class="min-temp">${Math.round(day.min_temp)}</span> °C
            </p>
        </div>
        <p class="forecast-weather-description">${day.weather.description}</p>`;
  });
  forecastContainer.innerHTML = `<div class="grid">${html}</div>`;
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

// === Default City ===
// renderWeather("chicago");
