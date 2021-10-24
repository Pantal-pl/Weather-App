const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const submitButton = document.getElementById("submit");
const wantedLocation = document.getElementById("location");
const API_KEY = "63666c334cedf876a8067a31186d7ff2";
const menuButtonArea = document.querySelector(".menu-button");
const menuButton = menuButtonArea.querySelector(".menu-button");
const menu = document.querySelector(".menu");
const currentLocationButton = document.getElementById("current-location");
const alertBanner = document.querySelector(".alert");
const successBanner = document.querySelector(".success");
const body = document.querySelector("body");
const snow = document.getElementById("snowCanvas");
const layer = [];
for (let i = 0; i < 3; ++i) {
  layer[i] = document.getElementById(`layer${i}`);
}
function menuActive() {
  menu.classList.toggle("menu-active");
  layer1.classList.toggle("layer1-active");
  layer2.classList.toggle("layer3-active");
  layer3.classList.toggle("layer2-active");
}

currentLocationButton.addEventListener("click", () => {
  menuActive();
  wantedLocation.value = null;
  getWeatherData();
});

menuButtonArea.addEventListener("click", () => {
  menuActive();
});

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm"></span>${ampm}</div>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function getAnyLocationData() {
  submitButton.addEventListener("click", () => {
    if (wantedLocation.value === "") {
      alertBanner.style = "top:0";
      alertBanner.classList.add("shake-horizontal");
      setTimeout(() => {
        alertBanner.style = "top:-12vh";
        alertBanner.classList.remove("shake-horizontal");
      }, 1800);
    } else {
      successBanner.style = "top:0";
      setTimeout(() => {
        successBanner.style = "top:-12vh";
      }, 1000);

      menuActive();
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          wantedLocation.value +
          "&appid=63666c334cedf876a8067a31186d7ff2"
      )
        .then((response) => response.json())
        .then((data) => {
          showAnyLocationData(data);
        });
    }
  });
}

getAnyLocationData();

function showAnyLocationData(data) {
  let { feels_like, humidity, pressure, dew_point } = data.main;
  let { sunrise, sunset } = data.sys;
  let { speed } = data.wind;

  let { lat, lon } = data.coord;
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutly&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      showWeatherData(data);
      console.log(data)
    });

  timezone.innerHTML = data.sys.country + " / " + data.name;
  countryEl.innerHTML =
    data.coord.lat + " &#176;N " + data.coord.lon + " &#176;E";

  currentWeatherItemsEl.innerHTML = `
  <h2 id="details">Details</h2>
    <div class="weather-item" id="humidity">
    <img src="images/humidity.svg" alt="">
    <p>Humidity</p>
    <p>${humidity}%</p>
  </div>
  <div class="weather-item" id="pressure">
  <img src="images/pressure.svg" alt="">
    <p>Pressure</p>
    <p>${pressure} HpA</p>
  </div>
  <div class="weather-item" id="wind-speed">
  <img src="images/wind-speed.svg" alt="">
    <p>Wind Speed</p>
    <p>${speed} MpH</p>
  </div>
  <div class="weather-item" id="dew-point">
  <img src="images/dew-point.svg" alt="">
  <p>Dew point</p>
  <p>${Math.round(dew_point)} &#176;C</p>
  </div>
  <div class="weather-item" id="feels-like">
  <img src="images/feels-like.svg" alt="">
  <p>Feels like</p>
  <p>${Math.round(feels_like - 273.15)} &#176;C</p>
  </div>
  <div class="weather-item" id="sunrise">
  <div><img src="images/sunrise.svg" alt=""></div>
  <div><p>Sunrise</p>
  <p class="sun-time sun-time-first">${window
    .moment(sunrise * 1000)
    .format("HH:mm")}</p></div>
  </div>
    <div class="weather-item" id="sunset">
    <div><img src="images/sunset.svg" alt=""></div>
    <div><p>Sunset</p>
    <p class="sun-time sun-time-second">${window
      .moment(sunset * 1000)
      .format("HH:mm")}</p></div>
    </div>
  `;
}

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutly&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);

      });
    
  });
}
getWeatherData();

function showWeatherData(data) {
  let {
    feels_like,
    humidity,
    pressure,
    sunrise,
    sunset,
    wind_speed,
    dew_point,
  } = data.current;

  let weatherDescription = data.current.weather[0].main;
  
  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + " &#176;N " + data.lon + " &#176;E";
  if (weatherDescription === "Clear") {
    document.querySelector(".clouds").style = "display:none";
    snow.style = "display:none;";
    document.querySelector("#canvas").style = "display:none;";
    menu.style =
      menuButton.style =
      body.style =
        "background: linear-gradient(20deg,rgba(35, 110, 250, 0.863) 42%,rgba(85, 133, 223, 1) 100%";
  } else if (weatherDescription === "Clouds") {
    document.querySelector(".clouds").style = "display:block";
    snow.style = "display:none;";
    document.querySelector("#canvas").style = "display:none;";
    menu.style =
      menuButton.style =
      body.style =
        "background: linear-gradient(20deg,rgba(132, 135, 139, 0.863) 22%,rgb(106, 108, 112) 100%);";
  } else if (weatherDescription === "Rain") {
    document.querySelector(".clouds").style = "display:none";
    snow.style = "display:none;";
    document.querySelector("#canvas").style = "display:block;";
    menu.style =
      menuButton.style =
      body.style =
        "background: linear-gradient(32deg,rgba(148, 150, 153, 0.863) 2%,rgb(29, 36, 49) 100%);";
  } else if (weatherDescription === "Thunderstorm") {
    document.querySelector(".clouds").style = "display:none";
    snow.style = "display:none;";
    document.querySelector("#canvas").style = "display:block;";
    menu.style =
      menuButton.style =
      body.style =
        "background: linear-gradient(30deg,rgba(148, 150, 153, 0.863) 2%,rgb(29, 36, 49) 100%);";
  } else if (weatherDescription === "Drizzle") {
    document.querySelector(".clouds").style = "display:none";
    snow.style = "display:none;";
    document.querySelector("#canvas").style = "display:block;";
    menu.style =
      menuButton.style =
      body.style =
        "background: linear-gradient(10deg,rgba(104, 108, 117, 0.863) 20%,rgb(114, 118, 128) 80%);";
  } else if (weatherDescription === "Snow") {
    document.querySelector(".clouds").style = "display:none";
    document.querySelector("#canvas").style = "display:none;";
    snow.style = "display:block;";
    menu.style =
      menuButton.style =
      body.style =
        "background: linear-gradient(10deg,rgba(104, 108, 117, 0.863) 20%,rgb(175, 190, 219) 80%);";
  }
  currentWeatherItemsEl.innerHTML = `
  <p id="details">Details</p>
    <div class="weather-item" id="humidity">
    <img src="images/humidity.svg" alt="">
    <p>Humidity</p>
    <p>${humidity}%</p>
  </div>
  <div class="weather-item" id="pressure">
  <img src="images/pressure.svg" alt="">
    <p>Pressure</p>
    <p>${pressure} HpA</p>
  </div>
  <div class="weather-item" id="wind-speed">
  <img src="images/wind-speed.svg" alt="">
    <p>Wind Speed</p>
    <p>${Math.round(wind_speed)} MpH</p>
  </div>
  <div class="weather-item" id="dew-point">
    <img src="images/dew-point.svg" alt="">
    <p>Dew point</p>
    <p>${Math.floor(dew_point)} &#176;C</p>
  </div>
  <div class="weather-item" id="feels-like">
    <img src="images/feels-like.svg" alt="">
    <p>Feels like</p>
    <p>${Math.round(feels_like)} &#176;C</p>
  </div>
  <div class="weather-item" id="sunrise">
    <div><img src="images/sunrise.svg" alt=""></div>
    <div><p>Sunrise</p>
    <p class="sun-time sun-time-first">${window
      .moment(sunrise * 1000)
      .format("HH:mm")}</p></div>
  </div>
    <div class="weather-item" id="sunset">
    <div><img src="images/sunset.svg" alt=""></div>
    <div><p>Sunset</p>
    <p class="sun-time sun-time-second">${window
      .moment(sunset * 1000)
      .format("HH:mm")}</p></div>
    </div>
  `;

  let otherDayForecast = "";

  data.daily.forEach((day, idx) => {
    if (idx === 0) {
      currentTempEl.innerHTML = `
      <div class="day" id="today-day">Today</div>
      <img src="https://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@4x.png"  id="today-w-icon"  class="w-icon" />
      <div class="temp today-temp today-temp-first" >${Math.round(
        day.temp.day
      )} &#176;C</div>
      <div class="temp today-temp today-temp-second" >${Math.round(
        day.temp.night
      )} &#176;C</div>
      `;
    } else {
      otherDayForecast += `
      <div class="weather-forecast-item">
            <div class="day">
              ${window.moment(day.dt * 1000).format("ddd")}
            </div>
            <div class="weather-description-item">
            <p>${
              day.weather[0].description.charAt(0).toUpperCase() +
              day.weather[0].description.slice(1)
            }</p>
            </div>
            <img src="https://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@4x.png" class="w-icon"/>
            <div class="forecast-temperature">
              <div class="temp" id="temp-with-separator">${Math.round(
                day.temp.day
              )}&#176; C
              </div>
              <div class="temp">${Math.round(day.temp.night)}&#176; C</div>
            </div>
          </div>
      `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecast;
}

let lastLocations = [];
let i = 0;

const addLocation = (ev) => {
  ev.preventDefault();
  let location = {
    location: wantedLocation.value,
  };
  lastLocations.push(location);
  document.forms[0].reset(),
    localStorage.setItem(
      "UserLastLocationsSearch",
      JSON.stringify(lastLocations)
    );
  document.querySelector(
    "#LAST"
  ).innerHTML += `<span id="last-search-value" style="padding: 0 5px; margin:5px;">&bull; ${location.location}</span>`;

  document.getElementById("last-search-value").addEventListener("click", () => {
    wantedLocation.value = location.location;
  });

  if (i === 3) {
    document
      .querySelector("#LAST")
      .removeChild(document.querySelector("#LAST").childNodes[0]);
    i = 2;
  }
  i++;
};


submitButton.addEventListener("click", addLocation);

// const desc = document.querySelector("#description1");
// const card = document.querySelector("#weather-item-deactive1");

// card.addEventListener("click", () => {
//   console.log("log");
//   desc.classList.toggle("description-active");
//   card.classList.toggle("card-active");
// });


{/* <div class="future-forecast-description" id="description${idx}">
<div class="future-forecast-description-item">
  <img src="images/pressure.svg" alt="" />
  <p>Pressure</p>
  <p>${data.daily[idx].pressure} HpA</p>
</div>
<div class="future-forecast-description-item">
  <img src="images/humidity.svg" alt="" />
  <p>Humidity</p>
  <p>${data.daily[idx].humidity}%</p>
</div>
<div class="future-forecast-description-item">
  <img src="images/wind-speed.svg" alt="" />
  <p>Wind Speed</p>
  <p>${Math.round(data.daily[idx].wind_speed)} MpH</p>
</div>
</div> */}