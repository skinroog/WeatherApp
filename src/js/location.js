function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default async function getUserLocation() {
  const position = await getPosition();

  const response = await fetch(`https://geocode-maps.yandex.ru/1.x?geocode=${position.coords.longitude},${position.coords.latitude}&apikey=cd0bd47c-5f52-4228-b580-3cde6b7d8c6b&format=json&results=1`);
  const result = await response.json();

  const cityName = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName;
  const countryName = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    address: `${cityName}, ${countryName}`,
  };
}
