import getWeather from './weather';
import getUserLocation from './location';
import displayWeather from './display';

export default function initSearchListeners() {
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

    const searchValue = searchInput.value;

    if (!searchValue) return;

    const response = await fetch(`https://geocode-maps.yandex.ru/1.x?geocode=${searchValue}&apikey=cd0bd47c-5f52-4228-b580-3cde6b7d8c6b&format=json&results=1`);
    const result = await response.json();

    if (result.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found === '0') return;

    const coords = result.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;

    const cityName = result.response.GeoObjectCollection.featureMember[0].GeoObject.name;
    const countryName = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;
    const address = `${cityName}, ${countryName}`;

    const weather = await getWeather(...coords.split(' ').reverse().map((i) => +i));

    displayWeather(weather, address);
  });
}

function initLocationSearch() {
  const locationButton = document.querySelector('[data-location-button]');

  locationButton.addEventListener('click', async () => {
    const location = await getUserLocation();
    const weather = await getWeather(location.latitude, location.longitude);

    displayWeather(weather, location.address);
  });
}
