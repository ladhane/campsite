mapboxgl.accessToken = mapToken;
  var map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12',
  center: campground.geometry.coordinates,
  zoom: 4
  });
  
  var marker = new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).addTo(map);