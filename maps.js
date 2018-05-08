// key: 'AIzaSyCFhL8GwvGsOKOSvJQMxXRd3pvHn'; 

function initMap(){
    //this is the Map options
    var settings = {
        zoom: 11, 
        center: {lat: 33.745571, lng: -117.867836},
        gestureHandling: 'greedy'
    }
    //this is to process the Map image on the browser
    var map = new google.maps.Map(document.getElementById('map'), settings);

    //this is to set the marker on the Map itself
    var marker = new google.maps.Marker({
        position: {lat: 33.745571, lng: -117.867836},
        //which Map do we want to add it to? 
        map: map, 
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    });
}