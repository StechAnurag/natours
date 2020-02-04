export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW51cmFnZmVyeSIsImEiOiJjazY1YmRubWMwOW5kM3NwN2NqMDVqNGNoIn0.If07PJK24h1R2mDpMD-eHw';

  var map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/mapbox/streets-v11'
    style: 'mapbox://styles/anuragfery/ck65tfsb406a61ipdyq7y0e11',
    scrollZoom: false
    /* center: [-118.137512, 34.125966],
  zoom: 4,
  interactive : false */
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add Popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
