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

const wrapperContainer = document.querySelector(".wrapper");
const currentWeatherContainer = document.querySelector(".main-weather");
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

// Geocoding
async function getGeocoding(city) {
  const responseGeo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=6bec232055e3f161982b528c34084fba`
  );

  if (!responseGeo?.ok) {
    throw new Error("An error has ocurred during geocoding");
  }

  const [dataGeo] = await responseGeo.json();
  const lon = dataGeo.lon;
  const lat = dataGeo.lat;
  return [lon, lat];
}

// Weather data
async function getWeather(city) {
  try {
    const geocoding = await getGeocoding(city);
    const key = "a1921bd56aaa472aba50748fba60247c";

    if (!geocoding) {
      console.error("Geocoding failed");
    }

    const [lon, lat] = geocoding;

    // current weather
    const responseWeather = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${key}`
    );

    // Forecast weather
    const responseForecast = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}&days=5`
    );

    if (!responseWeather?.ok || !responseForecast?.ok) {
      throw new Error("Weather data fetching error");
    }

    const { data: currentWeather } = await responseWeather.json();
    const [dataWeather] = currentWeather;

    const { data: dataForecast } = await responseForecast.json();

    return [dataWeather, dataForecast];
  } catch (error) {
    console.error(
      `An error occurred while getting weather or geocoding data: ${error.message}`
    );

    throw error;
  }
}

//  ==Render weather - DOM manipulation==

async function renderWeather(city) {
  try {
    currentWeatherContainer.style.opacity = 0;
    forecastContainer.style.opacity = 0;
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

    // Update UI (main section)
    const [dataWeather] = await getWeather(city);
    if (!dataWeather) {
      console.error("Error getting current weather data");
    }
    mainDate.textContent = dateNTime;
    cityName.textContent = dataWeather.city_name;
    feelTemp.textContent = Math.round(dataWeather.app_temp);
    mainWeather.textContent = dataWeather.weather.description;
    mainWeatherImg.src = `https://cdn.weatherbit.io/static/img/icons/${dataWeather.weather.icon}.png`;
    mainWeatherImg.alt = dataWeather.weather.description;
    mainTemp.textContent = Math.round(dataWeather.temp);
    humidity.textContent = dataWeather.rh;
    wind.textContent = Math.round(dataWeather.wind_spd * 3.6);

    currentWeatherContainer.style.opacity = 1;

    // Update UI (forecast data)
    const [, dataForecast] = await getWeather(city);
    if (!dataForecast) {
      console.error("Error getting forecast weather data");
    }

    let html = `<div class="grid">`;

    dataForecast.forEach((day) => {
      html += `

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
    html += `</div>`;
    forecastContainer.innerHTML = html;
    forecastContainer.style.opacity = 1;
  } catch (error) {
    console.error(
      `An error occurred while rendering weather: ${error.message}`
    );

    wrapperContainer.innerHTML = `<p class="error-message">Oops! Something went wrong 🙈. Try again later!</p>`;

    throw error;
  }
}

// ========Event handlers========

function defineCity() {
  try {
    const city = searchInput.value;
    renderWeather(city);
    searchInput.value = "";
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  defineCity();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchInput.value) defineCity();
});

// === Default City ===
renderWeather("chicago");
