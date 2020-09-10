import { getWeather } from './weather';
import { getUserLocation } from './location';
import { initSearchListeners } from './search';
import { displayWeather, togglePreloader } from './display';

window.addEventListener('load', () => {
  window.addEventListener('unhandledrejection', (event) => {
    togglePreloader();
    console.log(event);
  });

  window.onerror = (error) => {
    togglePreloader();
    console.log(error);
  }

  showUserLocalWeather();
  setCurrentDate();
  initSearchListeners();
});

async function showUserLocalWeather() {
  togglePreloader();
  const location = await getUserLocation();
  const weather = await getWeather(location.latitude, location.longitude);
  await displayWeather(weather, location.address);
  togglePreloader();
}

function setCurrentDate() {
  const dateLine = document.querySelector('.app__date');

  const currentDate = new Date();
  const date = currentDate.getDate() >= 10 ? currentDate.getDate() : `0${currentDate.getDate()}`;
  const month = currentDate.getMonth() >= 10 ? currentDate.getMonth() + 1 : `0${currentDate.getMonth() + 1}`;
  const year = currentDate.getFullYear();

  dateLine.innerHTML = `${date}.${month}.${year}`;
}
