import { addWarning } from './display';

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export async function getUserLocation() {
  let position;

  try {
    if (localStorage.getItem('locationAllowed') === 'false') throw new Error('Geolocation does not allowed');
    position = await getPosition();
    localStorage.setItem('locationAllowed', true);
  } catch (error) {
    if (error instanceof GeolocationPositionError && error.code === 1 || error.message === 'Geolocation does not allowed') {
      addWarning('Вы запретили определение геолокации. Найдите свой город\u00A0выше!\u00A0👆🏼');
      localStorage.setItem('locationAllowed', false);
    }
    throw error;
  }

  const apiKey = 'cd0bd47c-5f52-4228-b580-3cde6b7d8c6b';
  const response = await fetch(`https://geocode-maps.yandex.ru/1.x?geocode=${position.coords.longitude},${position.coords.latitude}&apikey=${apiKey}&format=json&results=1`);

  if (!response.ok) throw new Error(response.status);

  const result = await response.json();

  const cityName = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName;
  const countryName = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    address: `${cityName}, ${countryName}`,
  };
}
