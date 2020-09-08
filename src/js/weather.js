export default async function getWeather(lat, lon) {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=1dc9df05c4bbc873836c0d64a425d21d&lang=ru`;

  const response = await fetch(url);
  const weatherResults = await response.json();

  return filterWeatherResults(weatherResults);
}

function filterWeatherResults(results) {
  return {
    temperature: results.main.temp,
    feelsLike: results.main.feels_like,
    description: results.weather[0].description,
    wind: results.wind.speed,
    humidity: results.main.humidity,
    pressure: results.main.pressure,
    clouds: results.clouds.all,
    icon: results.weather[0].icon,
  };
}
