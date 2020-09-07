export default function displayWeather(weather, address) {
  clearSearchValue();

  const place = document.querySelector('.app__location');
  const temperature = document.querySelector('.weather-main__temp-value');
  const description = document.querySelector('.weather-main__desc');
  const feelsLike = document.querySelector('.weather-main__feels-like-value');

  const wind = document.querySelector('[data-wind-value]');
  const humidity = document.querySelector('[data-humidity-value]');
  const pressure = document.querySelector('[data-pressure-value]');
  const clouds = document.querySelector('[data-clouds-value]');

  initChangeUnitsListener(temperature, feelsLike);

  place.textContent = address;
  temperature.textContent = formatTemperature(weather.temperature);
  feelsLike.textContent = formatTemperature(weather.feelsLike);
  description.textContent = weather.description;

  wind.textContent = weather.wind.toFixed(1) + ' м/с';
  humidity.textContent = Math.round(weather.humidity) + ' %';
  pressure.textContent = changePressureUnits(weather.pressure) + ' мм рт. ст.';
  clouds.textContent = Math.round(weather.clouds) + ' %';

  function clearSearchValue() {
    const inputSearch = document.querySelector('[data-search-input]');
    inputSearch.value = '';
  }

  function changePressureUnits(value) {
    return Math.round(value * 0.75006375541921);
  }
}

function initChangeUnitsListener(temperature, feelsLike) {
  const temperatureUnitsToggle = document.querySelector('.weather-main__temp-unit');
  temperatureUnitsToggle.textContent = 'C';

  temperatureUnitsToggle.onclick = () => {
    if (temperatureUnitsToggle.textContent === 'C') {
      temperatureUnitsToggle.textContent = 'F';

      temperature.textContent = formatTemperature(+temperature.textContent * 1.8 + 32);
      feelsLike.textContent = formatTemperature(+feelsLike.textContent * 1.8 + 32);
    } else {
      temperatureUnitsToggle.textContent = 'C';

      temperature.textContent = formatTemperature((+temperature.textContent - 32) / 1.8);
      feelsLike.textContent = formatTemperature((+feelsLike.textContent - 32) / 1.8);
    }
  };
}

function formatTemperature(value) {
  value = Math.round(value);
  if (value > 0) return `+${value}`;
  return value;
}
