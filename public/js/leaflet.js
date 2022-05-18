function createMap(object) {
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tiles = L.tileLayer(tileURL, { attribution });

  var map = L.map("map").setView([object.lat, object.lng], 13);

  tiles.addTo(map);
  return map;
}

async function getUserLocation() {
  return new Promise(async (resolve, reject) => {
    if (!navigator.geolocation) return reject(false); // Geolocation not supported;
    navigator.geolocation.getCurrentPosition(function (showPosition) {
      return resolve({
        lat: showPosition.coords.latitude,
        lng: showPosition.coords.longitude,
      });
    });
  });
}

function marker(lat, lng, map) {
  return L.marker([lat, lng]).addTo(map);
}

function circle(lat, lng, map, option) {
  return L.circle([lat, lng], {
    color: option === undefined ? "red" : option.color,
    fillColor: option === undefined ? "#f03" : option.fillColor,
    fillOpacity: option === undefined ? 0.5 : option.fillOpacity,
    radius: option === undefined ? 500 : option.radius,
  }).addTo(map);
}

function round(number) {
  return Math.round(number * 1000) / 1000;
}

function populateStations(object, map) {
  for (let i = 0; i < object.records.length; i++) {
    let lng = object.records[i].fields.geom.coordinates[0];
    let lat = object.records[i].fields.geom.coordinates[1];
    let option = {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.9,
      radius: 25,
    };
    circle(lat, lng, map, option);
  }
}

function drawRainbow(map) {
  // const topleft = L.latLng(49.318959, -123.077429), // N.Van
  //   topright = L.latLng(49.250687, -123.003881), BBY
  //   bottomleft = L.latLng(49.283443, -123.115244); DTC

  const bottomleft = L.latLng(49.323145, -123.100153),
    topright = L.latLng(49.250687, -123.003881),
    topleft = L.latLng(49.283443, -123.115244);

  let overlay = L.imageOverlay
    .rotated("./imgs/rainbow_flipped.png", topleft, topright, bottomleft, {
      opacity: 0.6,
      interactive: true,
      attribution: "It's raining men, Hallelujuh",
    })
    .addTo(map);
  console.log({ overlay });
}

(async () => {
  let location = await getUserLocation();
  let map = createMap(location);

  var popup = L.popup();

  marker(location.lat, location.lng, map); // User's current location

  console.log(await fetchVanData());
  // populateStations(sampleData, map)

  map.on("click", (e) => {
    popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
  });

  drawRainbow(map);
})();
