jQuery(() => {
  // Asynchronously Load the map API
  const script = document.createElement('script');
  script.src = '//maps.googleapis.com/maps/api/js?sensor=false&callback=initialize';
  document.body.appendChild(script);
});

// eslint-disable-next-line no-unused-vars
function initialize() {
  const bounds = new google.maps.LatLngBounds();
  const mapOptions = {
    mapTypeId: 'roadmap',
  };

    // Display a map on the page
  const map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  map.setTilt(45);

  // Multiple Markers
  const markers = [
    ['The Pitts Family Home', 44.306708, -79.883224],
    ['The Knights Inn', 44.324692, -79.887076],
  ];

    // Info Window Content
  const infoWindowContent = [
    [`<div class="info_content">
    <h3><a href="https://www.google.com/maps/dir//18+Mill+Street+Angus+ON+L0M1B2">The Pitts Family Home<a></h3>
    <p>The ceremony and reception will be held at 18 Mill St, Angus, Ontario, the home of Michelle's parents.</p>
    <p><h5><a href="https://www.google.com/maps/dir//18+Mill+Street+Angus+ON+L0M1B2">Directions<a></h5></p>
    </div>`],
    [`<div class="info_content">
    <h3>The Knights Inn</h3>
    <p>The Knights Inn offers the perfect combination of affordable rates and unbeatable location, making it the best 2-star hotel in Angus.</p>
    <p><h5><a href="https://www.google.com/maps/dir//Knights+Inn+Angus+ON+L0M1B2">Directions<a></h5></p>
    </div>`],
  ];

  // Display multiple markers on a map
  const infoWindow = new google.maps.InfoWindow();
  let marker;
  let i;

  // Loop through our array of markers & place each one on the map
  for (i = 0; i < markers.length; i += 1) {
    const position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    bounds.extend(position);
    marker = new google.maps.Marker({
      position,
      map,
      title: markers[i][0],
    });

    // Allow each marker to have an info window
    google.maps.event.addListener(marker, 'click', ((mapMarker, index) => () => {
      infoWindow.setContent(infoWindowContent[index][0]);
      infoWindow.open(map, mapMarker);
    })(marker, i));

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
  }

  // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  const boundsListener = google.maps.event.addListener((map), 'bounds_changed', () => {
    this.setZoom(14);
    google.maps.event.removeListener(boundsListener);
  });
}
