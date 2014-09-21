function initialize()
{

var myCenter = new google.maps.LatLng(37.7833,-122.4167);
var mapProp = {
  // var lat = 51.508742;
  // var lng = -0.120850
  
  center:myCenter,
  zoom:13,
  mapTypeId:google.maps.MapTypeId.ROADMAP
  };
var map=new google.maps.Map(document.getElementById("googleMap")
  ,mapProp);

var marker=new google.maps.Marker({
  position:myCenter,
  });

marker.setMap(map);

  

};

google.maps.event.addDomListener(window, 'load', initialize);

