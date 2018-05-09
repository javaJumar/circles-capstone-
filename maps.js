const eventbriteKey = '4CMGDQLH3H24Q4O62ZR7';
const eventbriteUrl = 'https://www.eventbriteapi.com/v3';

//get the list of events 
function getEvents(interest, zipCode) {
    const endpoint =
        `${eventbriteUrl}/events/search/?q=${interest}&location.address=${zipCode}&location.within=50mi`;
    const options = {
        url: endpoint,
        headers: {
            'Authorization': `Bearer ${eventbriteKey}`
        }
    }
    $.get(options).done(response => {
        console.log(response);
        response.events.map(event => {
            return getVenue(event.venue_id)
        })
    }).fail(error => {
        console.log(error)
    })
}

function getVenue(ID) {
    const venueEndpoint =
        `${eventbriteUrl}/venues/${ID}/`;
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


function initMap() {
    //this is the Map options
    var settings = {
        zoom: 11,
        center: { lat: 33.745571, lng: -117.867836 },
        gestureHandling: 'greedy',
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    //this is to process the Map image on the browser
    var map = new google.maps.Map(document.getElementById('map'), settings);

    //this is to set the marker on the Map itself
    var marker = new google.maps.Marker({
        position: { lat: 33.745571, lng: -117.867836 },
        //which Map do we want to add it to? 
        map: map,
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
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
        getEvents(interest, zipCode);
    })
}

main();