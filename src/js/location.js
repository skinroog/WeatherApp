function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default async function getUserLocation() {
  const position = await getPosition();

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
