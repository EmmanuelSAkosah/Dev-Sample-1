
var map;
var userCount = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 3,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });
    //set map over hanover, nh
    var pt = new google.maps.LatLng(43.705228, -72.289919);
    map.setCenter(pt);
    map.setZoom(17);
    
    populateMap();
}  

function populateMap() {
    userCount = 0;
    
    //populate map with places, and number of users at places
    var placeRef = firebase.database().ref('testplaces');
     placeRef.on('child_added', function(data) {
        
        console.log("userCount");
        var place = data.val();
        var latLng = new google.maps.LatLng(place.latitude, place.longitude);
        console.log("" + place.latitude + " " + place.longitude);
        
        
        var infowindow = new google.maps.InfoWindow({
          content: "" + place.location + " " + place.people
        });
        
        var storage = firebase.storage();
        var iconRef = storage.ref().child('Markers').child(place.type + '_marker.png');
    
        iconRef.getDownloadURL().then(function(url) {
        // Place a marker at that location.
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          icon: url,
          title: place.location
        });
         marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        });

    });
    
    // Create a heatmap.
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map,
    radius: 8
   });
    
    var userRef = firebase.database().ref('users');
    userRef.on('child_added', function(data) {
       userCount+=1;
        if (userCount > 900){
           return;
        }
         var user = data.val();
         
        // Create a google.maps.LatLng object for the position of the marker.
        // A LatLng object literal (as above) could be used, but the heatmap
        // in the next step requires a google.maps.LatLng object.
        var latLng = new google.maps.LatLng(user.latitude, user.longitude);

        heatmap.getData().push(latLng);
         
         
     });
                 

}  

