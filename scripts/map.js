map = document.getElementById("mapviz");

function mapRefresh() {
  map.src = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&markers=color:blue%7Clabel:D%7C${phonedata.latitude},${phonedata.longitude}&markers=color:green%7Clabel:D%7C${gliderlocation.latitude},${gliderlocation.longitude}&key=AIzaSyConyh4OgmEdYTy7EfLCV2y-v6IK5NTXuc`;
}

setInterval(mapRefresh, 5000);