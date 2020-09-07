import getWeather from './weather';
import getUserLocation from './location';
import initSearchListeners from './search';
import displayWeather from './display';

startApp();
setCurrentDate();
initSearchListeners();

async function startApp() {
  const location = await getUserLocation();
  const weather = await getWeather(location.latitude, location.longitude);

  displayWeather(weather, location.address);
}

function setCurrentDate() {
  const dateLine = document.querySelector('.app__date');

  const currentDate = new Date();
  const date = currentDate.getDate() > 10 ? currentDate.getDate() : `0${currentDate.getDate()}`;
  const month = currentDate.getMonth() > 10 ? currentDate.getMonth() + 1 : `0${currentDate.getMonth() + 1}`;
  const year = currentDate.getFullYear();

  dateLine.innerHTML = `${date}.${month}.${year}`;
}
