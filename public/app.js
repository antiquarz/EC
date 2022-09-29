var map;
var results = Papa.parse("./dist/Walking.csv", {
  header: true,
  download: true,
  complete: function (results) {
    trajFun(results);
  }
});

var trajFun = function (resultsIn) {

  var traj = resultsIn['data'];
  map = L.map(document.getElementById('map'), {
    center: [traj[0]['phone_lat'], traj[0]['phone_long']],
    zoom: 15
  });

  var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  map.addLayer(layer);


  // drawPoints(traj, 'green');
  medianPoints(traj, 6);
  meanPoints(traj, 6);
}

function drawPoints(set, color) {
  let long;
  let lat;
  let latLong = [];
  let latlng;
  for (let m = 0; m < set.length - 1; m++) {
    if (set[m][1] != undefined) {
      long = set[m][1];
      lat = set[m][0];
    } else {
      long = set[m]['phone_long'];
      lat = set[m]['phone_lat'];
    }

    latlng = [lat, long];
    latLong.push(latlng);
  }
  // var polyline = L.polyline(latLong, {color: color, fillOpacity: opacity}).addTo(map);

  let count = 0;
  for (let m = 0; m < set.length - 1; m++) {
    let hslPart = 1/set.length;
    L.circle(latLong[m], { radius: 1, color: color, opacity: hslPart * m}).addTo(map);
    count++;
  }
  console.log(count);
}

function meanPoints(set, batch) {

  let counter = 0;
  let medLat = [];
  let medLong = [];
  let medC = [];

  for (let m = 0; m < (set.length / batch); m++) {
    for (let y = 0; y < batch - 1; y++) {
      if (set[counter]['phone_lat'] != undefined) {
        medLat[y] = set[counter]['phone_lat'];
        medLong[y] = set[counter]['phone_long'];
        counter++;
      }
    }
    medC.push([mean(medLat), mean(medLong)]);
  }
  // console.log(medC);
  // console.log(medC.length);
  drawPoints(medC, 'yellow', 0.3);
}

function medianPoints(set, batch) {

  let counter = 0;
  let medLat = [];
  let medLong = [];
  let medC = [];

  for (let m = 0; m < (set.length / batch); m++) {
    for (let y = 0; y < batch - 1; y++) {
      if (set[counter]['phone_lat'] != undefined) {
        medLat[y] = set[counter]['phone_lat'];
        medLong[y] = set[counter]['phone_long'];
        counter++;
      }
    }
    medC.push([median(medLat), median(medLong)]);
  }
  console.log(medC);
  drawPoints(medC, 'blue', 0.5);
}

function mean(values) {
  var sum = 0;
  values.forEach((num) => { sum += Number(num) });
  average = sum / values.length;

  return average;
}

function median(values) {
  if (values.length === 0) throw new Error("No inputs");

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}