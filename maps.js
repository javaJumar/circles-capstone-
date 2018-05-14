const eventbriteKey = '4CMGDQLH3H24Q4O62ZR7';
const eventbriteUrl = 'https://www.eventbriteapi.com/v3';
let map;

//get the list of events from Eventbrite API endpoint
function getEvents(interest, zipCode) {
    const endpoint =
        `${eventbriteUrl}/events/search/?q=${interest}&location.address=${zipCode}&location.within=5mi&expand=organizer,venue`;
    const options = {
        url: endpoint,
        headers: {
            'Authorization': `Bearer ${eventbriteKey}`
        }
    }
    // this gets the data from Eventbrite's endpoint
    $.get(options).done(response => {
        console.log(response);
        const events = response.events;
        const eventTemplate = (events.length) ? events.map(event =>
            createEventTemplate(event)) : `<p class='no-event'>Sorry, no results within your area!</p>`;
        const newLat = response.location.latitude;
        const newLng = response.location.longitude;
        centerMap(+newLat, +newLng);
        $('#events').html(eventTemplate);
        events.map(event =>
            createMarker(+event.venue.latitude, +event.venue.longitude, event.url, event.name.text));
        // events.map(event =>
        //     markerInfo(event));
    }).fail(error => {
        console.log(error)
    })
}

//this creates the event information in the left container
function createEventTemplate(event) {
    console.log(event);
    const startTime = event.start.local;
    const endTime = event.end.local;
    const newStartTime = moment(startTime).format('LLLL');
    const newEndTime = moment(endTime).format('LLLL');
    const eventLink = event.url;
    const logoUrl = event.logo ? event.logo.original.url : '';
    const logo = event.logo ? `<img class='event-pic' src='${logoUrl}' alt='event photo'>` : '';
    const content = `<div class='event-container'>
            ${logo}
            <p class ='event-heading'>${event.name.text}:</p> 
            <p class='times'>${newStartTime} to ${newEndTime}</p>
            <p class='event-description'>${event.description.text}:
            <a class='event-link' href='${eventLink}?token=4CMGDQLH3H24Q4O62ZR7' target="_blank">Event Link!</a></p>
            </div>`;
    return content;
}


function createMarker(lat, lng, url, title) {
    let marker = new google.maps.Marker({
        position: { lat, lng }, map,
        url: url
    });
    const infowindow = new google.maps.InfoWindow({
        content: `<div class = 'marker-info'>
        <p class='marker-title'>"${title}"</p>
        <a class='marker-link' href='${url}' target="_blank">Here's a link to the event!<a/>
        </div>`,
        maxWidth: 100
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
        console.log('marker');
        setTimeout(function () { infowindow.close(); }, 6000);
    });
    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });
}

function getAddressCoords(address, coords) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        address: address,
    }, coords);
    let coordinates = coords[0].geometry.location;
    let marker = new google.maps.Marker({
        map: coords,
        position: coordinates
    });
}

function centerMap(newLat, newLng) {
    var settings = {
        zoom: 11,
        center: { lat: newLat, lng: newLng },
        gestureHandling: 'greedy',
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    map = new google.maps.Map(document.getElementById('map'), settings);
}

function initMap() {
    //this is the Map options
    var settings = {
        zoom: 10,
        center: { lat: 34.052235, lng: -118.243683 },
        gestureHandling: 'greedy',
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    //renders Map on the browser
    map = new google.maps.Map(document.getElementById('map'), settings);
    let geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', function () {
        // getAddressCoords(geocoder, map);
    });

    //this is to set the marker on the Map itself
    var marker = new google.maps.Marker({
        position: { lat: 33.745571, lng: -117.867836 },
        //which Map do we want to add it to? 
        map: map
    });
}
// //calling Init 
function main() {
    onSubmit();
}

function onSubmit() {
    $('form').submit(event => {
        event.preventDefault();
        console.log(event);
        const interest = $('#interest').val();
        const zipCode = $('#zipCode').val();
        $('form').find('#interest').val("");
        $('form').find('#zipCode').val("");
        $('.hidden-element').show();
        getEvents(interest, zipCode);
    })
}

main();