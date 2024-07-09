// Global Variables...
var phonedata = {
  latitude: 0,
  longitude: 0,
  altitude: 0,
  alpha: 0,
  beta: 0
}

// Button Activation.
function requestPerms() {
  if (window.DeviceOrientationEvent && window.DeviceMotionEvent && navigator.geolocation) {
    // Request orientation data
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            console.log('Orientation permission granted');
            // Start listening to orientation data
            window.addEventListener('deviceorientation', startOrientationTracking, true);
          }
        })
        .catch(console.error);
    } else {
      console.log('Orientation permission not required');
      // Start listening to orientation data
      window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    }

    // Request location data
    if (typeof navigator.permissions !== 'undefined' && typeof navigator.permissions.query === 'function') {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'granted') {
            console.log('Location permission granted');
            // Get location data
            navigator.geolocation.getCurrentPosition(handlePositionData, handleError);
          }
        })
        .catch(console.error);
    } else if ('geolocation' in navigator) {
      console.log('Location permission not required');
      // Get location data
      navigator.geolocation.getCurrentPosition(handlePositionData, handleError);
    } else {
      console.log('Geolocation API not supported');
      document.getElementById("header").style.background = "red";
      document.getElementById("conn_status").textContent = "Not Connected."
      return;
    }
  } else {
    console.log('Device orientation, motion, or geolocation not supported');
    document.getElementById("header").style.background = "red";
    document.getElementById("conn_status").textContent = "Not Connected."

    return;
  }

  // Init Orientation
  window.addEventListener("deviceorientation", handleDeviceOrientation, true);
  document.getElementById("locperm").style.display = "None";
  setInterval(handleDeviceGPS);
  document.getElementById("conn_status").textContent = "Connected!"

}

function handleDeviceOrientation(event) {
  var alpha = event.alpha; // rotation around z-axis (compass direction)
  var beta = event.beta;   // rotation around x-axis (front-back tilt)
  var gamma = event.gamma; // rotation around y-axis (left-right tilt)
  //Check if absolute values have been sent
  if (typeof event.webkitCompassHeading !== "undefined") {
    alpha = event.webkitCompassHeading; //iOS non-standard
  }

  if (alpha > 180) {
    alpha -= 360;
  }

  
  
  // Use the alpha, beta, and gamma values for your application
  document.getElementById("alpha").textContent =
    `Bearing: ${alpha.toFixed(3)}`;
  document.getElementById("beta").textContent =
    `Pitch: ${beta.toFixed(4)}`;
  document.getElementById("gamma").textContent =
    `Yaw:${gamma.toFixed(4)}`;

  phonedata.alpha = alpha;
  phonedata.beta = beta;
}

function handleDeviceGPS() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(handlePositionData, handleError);
  } else {
    // Geolocation is not available in this browser
    console.log("Geolocation not available in this browser");
  }
}

function handlePositionData(position) {
  // Handle successful position retrieval
  phonedata.latitude = position.coords.latitude;
  phonedata.longitude = position.coords.longitude;
  phonedata.altitude = position.coords.altitude;
  // Use latitude and longitude data
  document.getElementById("lat").textContent = 
    `Lat: ${phonedata.latitude.toFixed(4)}`
  document.getElementById("long").textContent = 
    `Long: ${phonedata.longitude.toFixed(4)}`;
  document.getElementById("alt").textContent = 
    `Alt: ${phonedata.altitude.toFixed(4)}`;


}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
  console.log(error);
}
