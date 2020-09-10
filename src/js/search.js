import { getWeather } from './weather';
import { getUserLocation } from './location';
import { displayWeather, addWarning, togglePreloader } from './display';

export function initSearchListeners() {
  initInputSearch();
  initLocationSearch();
}

function initInputSearch() {
  const searchInput = document.querySelector('[data-search-input]');
  const searchForm = document.querySelector('[data-search-form]');

  ymaps.ready(init);

  function init() {
    let suggestView1 = new ymaps.SuggestView(searchInput);
  }

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    togglePreloader();

    const searchValue = searchInput.value;

    if (!searchValue) {
      togglePreloader();
      return;
    }

    const apiKey = 'cd0bd47c-5f52-4228-b580-3cde6b7d8c6b';
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x?geocode=${searchValue}&apikey=${apiKey}&format=json&results=1`);

    if (!response.ok) throw new Error(response.status);

    const result = await response.json();

    if (result.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found === '0') {
      addWarning('По вашему запросу город не найден 😞. Попробуйте снова!');
      togglePreloader();
      return;
    }

    const coords = result.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;

    let cityName;

    for (let component of result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components) {
      if (component.kind === 'locality') cityName = component.name;
    }

    if (!cityName) cityName = result.response.GeoObjectCollection.featureMember[0].GeoObject.name;

    const countryName = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;

    if (cityName === countryName) {
      addWarning('Введите корректное название города 😕');
      togglePreloader();
      return;
    }

    const address = `${cityName}, ${countryName}`;

    const weather = await getWeather(...coords.split(' ').reverse().map((i) => +i));

    await displayWeather(weather, address);

    togglePreloader();
  });
}

function initLocationSearch() {
  const locationButton = document.querySelector('[data-location-button]');

  locationButton.addEventListener('click', async () => {
    togglePreloader();
    const location = await getUserLocation();
    const weather = await getWeather(location.latitude, location.longitude);
    await displayWeather(weather, location.address);
    togglePreloader();
  });
}
