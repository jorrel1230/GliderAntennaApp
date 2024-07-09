const EARTH_RADIUS = 6371 * 1000 // km to m

var globalBearing = 0;
var globalAltAngle = 0;


//Converts deg to rad and vice versa
function rad2deg(rad) {
  return rad * 180 / Math.PI;
}
function deg2rad(deg) {
  return deg * Math.PI / 180;
}

// Simple Bearing Calculations
// Expects LatLong in Radians...
function bearingCalc(la1, lo1, la2, lo2) {
  var y = Math.sin(deg2rad(lo2 - lo1)) * Math.cos(deg2rad(la2));

  var x = Math.cos(deg2rad(la1)) * Math.sin(deg2rad(la2)) - Math.sin(deg2rad(la1)) * Math.cos(deg2rad(la2)) * Math.cos(deg2rad(lo2 - lo1));
  var brng = Math.atan2(y, x);
  brng = rad2deg(brng);
  console.log("bearing  = ", brng);
  return brng;
}

// Simple Altitude Calculations
function altCalc(devAlt, targAlt, distance) {
  dAlt = targAlt - devAlt
  phi = Math.atan(dAlt / distance)
  return rad2deg(phi);
}

// Computes Distance between Phone and Object, as if both were on earth's surface
function distCalc(devLat, devLong, targLat, targLong) {

  devLat = deg2rad(devLat);
  devLong = deg2rad(devLong);
  targLat = deg2rad(targLat);
  targLong = deg2rad(targLong);

  var devPoint = {
    Xpos: (EARTH_RADIUS * Math.cos(devLat) * Math.cos(devLong)),
    Ypos: (EARTH_RADIUS * Math.cos(devLat) * Math.sin(devLong)),
    Zpos: (EARTH_RADIUS * Math.sin(devLat))
  };

  var targPoint = {
    Xpos: (EARTH_RADIUS * Math.cos(targLat) * Math.cos(targLong)),
    Ypos: (EARTH_RADIUS * Math.cos(targLat) * Math.sin(targLong)),
    Zpos: (EARTH_RADIUS * Math.sin(targLat))
  };


  deltaX = devPoint.Xpos - targPoint.Xpos;
  deltaY = devPoint.Ypos - targPoint.Ypos;
  deltaZ = devPoint.Zpos - targPoint.Zpos;

  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2));
}


// Handles Locations
function locationHandler() {

  var latitude = phonedata.latitude;
  var longitude = phonedata.longitude;
  var targLatitude = gliderlocation.latitude;
  var targLongitude = gliderlocation.longitude;

  //m
  var alt = phonedata.altitude;
  var targAlt = gliderlocation.altitude;

  // Calculations for Bearing
  pointDegree = bearingCalc(latitude, longitude, targLatitude, targLongitude);
  globalBearing = pointDegree;

  // Altitude Calculations
  distanceBtwn = distCalc(latitude, longitude, targLatitude, targLongitude);
  globalAltAngle = altCalc(alt, targAlt, distanceBtwn);


  document.getElementById("bearing").textContent = `Bearing: ${pointDegree.toFixed(4)}`;
  document.getElementById("altangle").textContent = `Alt Angle: ${globalAltAngle.toFixed(4)}`;
  document.getElementById("glat").textContent = `Latitude: ${targLatitude.toFixed(4)}`;
  document.getElementById("glong").textContent = `Longitude: ${targLongitude.toFixed(4)}`;
  document.getElementById("galt").textContent = `Altitude: ${targAlt.toFixed(4)}`;


}



var chart;

// Initiailizes Chart Properites
function initChart() {
  // Initialize chart data
  var data = {
    labels: ['Crosshair', 'Red Dot'],
    datasets: [
      {
        label: 'Points',
        data: [],
        pointBackgroundColor: ['black', 'red'],
        pointRadius: 7,
        fill: false,
      }
    ]
  };

  // Chart options
  var options = {
    scales: {
      x: {
        min: -180,
        max: 180,
        ticks: {
          stepSize: 60
        }
      },
      y: {
        min: -120,
        max: 120,
        ticks: {
          stepSize: 60
        }
      }
    }
  };

  // Initialize chart
  var ctx = document.getElementById('myChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: options
  });
  chart.options.animation = false; // disables all animations
}

// Function to update chart data
function updateChart() {

  var bearingDiff = phonedata.alpha - (globalBearing);
  var altDiff = phonedata.beta - (globalAltAngle);

  document.getElementById("diffbearing").textContent = `ΔBearing: ${bearingDiff.toFixed(4)}`;
  document.getElementById("diffaltangle").textContent = `ΔAlt Angle: ${altDiff.toFixed(4)}`;

  chart.data.datasets[0].data = [
    { x: bearingDiff, y: altDiff },   // Crosshair
    { x: 0, y: 0 }                    // Red Dot
  ];
  if (phonedata.beta > 135) {
    document.body.style.backgroundColor = "red";
  }
  else if (Math.abs(altDiff) < 4 && Math.abs(bearingDiff) < 4) {
    document.body.style.backgroundColor = "green";
  }
  else {
    document.body.style.backgroundColor = "white";
  }

  chart.update();
}

initChart();
setInterval(locationHandler);
setInterval(updateChart);