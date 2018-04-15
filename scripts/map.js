// eslint-disable-next-line no-unused-vars
function initMap() {
  const markers = [
    {
      name: 'The Pitts Family Home',
      lat: 44.306708,
      lng: -79.883224,
      directions: '<h5><a href="https://www.google.com/maps/dir//18+Mill+Street+Angus+ON+L0M1B2">Directions<a></h5>',
      description: 'The ceremony and reception will be held at 18 Mill St, Angus, Ontario, the home of Michelle\'s parents.',
    },
    {
      name: 'The Knights Inn',
      lat: 44.324692,
      lng: -79.887076,
      directions: '<h5><a href="https://www.google.com/maps/dir//Knights+Inn+Angus+ON+L0M1B2">Directions<a></h5>',
      description: '<p>The Knights Inn offers the perfect combination of affordable rates and unbeatable location, making it the best 2-star hotel in Angus.</p>',
    },
  ];
  const centerPoint = { lat: 44.316, lng: -79.885 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: centerPoint,
  });
    // loop through all markers
  markers.forEach((marker) => {
    const mapMarker = new google.maps.Marker({
      position: { lat: marker.lat, lng: marker.lng },
      map,
      title: marker.name,
    });
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${marker.name}</h3>${marker.description}${marker.directions}`,
      maxWidth: 350,
    });
    mapMarker.addListener('click', () => {
      infoWindow.open(map, mapMarker);
    });
  });
}
