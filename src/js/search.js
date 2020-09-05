import startApp from './script';
import getWeather from './weather';

function initInputSearch() {
  const searchInput = document.querySelector('[data-search-input]');
  const searchForm = document.querySelector('[data-search-form]');

  ymaps.ready(init);

  function init() {
      var suggestView1 = new ymaps.SuggestView(searchInput);
  }
}

function initLocationSearch() {
  const locationButton = document.querySelector('[data-location-button]');

  locationButton.addEventListener('click', () => {
    startApp();
  });
}

export default function initSearchListeners() {
  initInputSearch();
  initLocationSearch();
}
