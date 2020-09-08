export default async function displayWeather(weather, address) {
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
    inputSearch.blur();
  }

  function changePressureUnits(value) {
    return Math.round(value * 0.75006375541921);
  }

  const icon = document.querySelector('.weather-main__icon');
  icon.src = `icons/${weather.icon}.svg`;

  let backgroundImageSrc;

  try {
    backgroundImageSrc = await getPixabyPicture(weather.description);
  } catch (error) {
    backgroundImageSrc = 'default-background.jpg';
  }

  document.body.style.backgroundImage = `url(${backgroundImageSrc})`;
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

async function getPixabyPicture(description) {
  const queryText = description.replace(/\s/g, '+');

  const apiKey = '18227191-fcb06157a5540c6d2c9d55d91';
  const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${queryText}&lang=ru&image_type=photo&category=backgrounds+nature+places&per_page=3`);

  if (!response.ok) throw new Error('Image did not received');

  const result = await response.json();

  return result.hits[0].largeImageURL;
}
