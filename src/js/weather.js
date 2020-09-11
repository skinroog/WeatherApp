export async function getWeather(lat, lon) {
  const apiKey = '1dc9df05c4bbc873836c0d64a425d21d';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=ru`);

  if (!response.ok) throw new Error(response.status);

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
