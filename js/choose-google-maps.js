function initialize()
{
var mapProp = {
  // var lat = 51.508742;
  // var lng = -0.120850
  center:new google.maps.LatLng(37.7833,-122.4167),
  zoom:13,
  mapTypeId:google.maps.MapTypeId.ROADMAP
  };
var map=new google.maps.Map(document.getElementById("googleMap")
  ,mapProp);

var marker=new google.maps.Marker({
  position:center,
  });

marker.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);

