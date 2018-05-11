const eventbriteKey = '4CMGDQLH3H24Q4O62ZR7';
const eventbriteUrl = 'https://www.eventbriteapi.com/v3';

//get the list of events 
function getEvents(interest, zipCode) {
    const endpoint =
        `${eventbriteUrl}/events/search/?q=${interest}&location.address=${zipCode}&location.within=80mi`;
    const options = {
        url: endpoint,
        headers: {
            'Authorization': `Bearer ${eventbriteKey}`
        }
    }
    $.get(options).done(response => {
        console.log(response);
        for (let i = 0; i < 15; i++) {
            const startTime = response.events[i].start.local;
            const endTime = response.events[i].end.local;
            const newStartTime = moment(startTime).format('LLLL');
            const newEndTime = moment(endTime).format('LLLL');
            const content = `<div class='event-container'>
            <img class='event-pic' src='${response.events[i].logo.original.url}' alt='event photo'><p class ='event-heading'>${response.events[i].name.text}:</p> 
            <p class='times'>${newStartTime} -- ${newEndTime}</p>
            <p>${response.events[i].description.text}</p>
            </div>`;
            $('#events').append(content);
        }
        // response.events.map(event => {
        //     return getVenue(event.venue_id)
        // })
    }).fail(error => {
        console.log(error)
    })
}

function getVenue(id) {
    const venueEndpoint =
        `${eventbriteUrl}/venues/${id}/`;
    const venueOptions = {
        url: venueEndpoint,
        headers: {
            'Authorization': `Bearer ${eventbriteKey}`
        }
    }
    $.get(venueOptions).done(response => {
        console.log(response);
    }).fail(error => {
        console.error(error);
    })
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


function initMap() {
    //this is the Map options
    var settings = {
        zoom: 11,
        center: { lat: 33.745571, lng: -117.867836 },
        gestureHandling: 'greedy',
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    //renders Map on the browser
    var map = new google.maps.Map(document.getElementById('map'), settings);
    let geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', function () {
        getAddressCoords(geocoder, map);
    });

    //this is to set the marker on the Map itself
    var marker = new google.maps.Marker({
        position: { lat: 33.745571, lng: -117.867836 },
        //which Map do we want to add it to? 
        map: map
    });
}
//calling Init 
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
        getEvents(interest, zipCode);
    })
}

main();