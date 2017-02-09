var itinerary = [];
var itineraryIndex = 0;
var countriesArray = [];
var map;
var startMarker;
var nextMarker;
var initialLocation = {
    latitude: 33.6362183,
    longitude: -117.7394721
}; //We start at LearningFuze!

callRESTCountries();

function createMap() {
    console.log('createMap was called');

    var mapProp = {
        center: new google.maps.LatLng(initialLocation.latitude, initialLocation.longitude),
        zoom: 4,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    startMarker = new google.maps.Marker({
        position: mapProp.center,
        icon: 'graphics/flight.png'
    });
    startMarker.setMap(map);
}

function markNextLocation(){
    nextMarker = new google.maps.Marker({
        position: new google.maps.LatLng(itinerary[itineraryIndex].location.lat, itinerary[itineraryIndex].location.lng),
        icon: 'graphics/magnifier.png'
    });
    nextMarker.setMap(map);
    startMarker.icon = 'graphics/flight.png';
    startMarker.setMap(map);
    startMarker.addListener('click', function(){
        map.panTo(nextMarker.getPosition());
        startMarker = nextMarker;
    });
    itineraryIndex++;

}

function callGeocoder(urlString, j){
    $.ajax({
        dataType: 'json',
        url: urlString,
        method: 'GET',
        success: function (response) {
            console.log('yay: ', response);
            itinerary[j].location = response.results[0]['geometry'].location;
        },
        error: function (response) {
            console.log('boo ', response);
        }
    });
}

function callRESTCountries(){
    $.ajax({
        dataType:'json',
        url: 'https://restcountries.eu/rest/v1/all',
        method: 'GET',
        success: function(response){
            countriesArray = response;
            createItinerary();
        },
        error: function(){
            console.log('the call did not work...');
        }
    })
}

function createItinerary(){
    console.log('createItinerary called');
    for (var i = 0; i < 4; i++){
        var randomNumber = Math.floor(Math.random()*251);
        var randomCountry = countriesArray[randomNumber];
        itinerary[i] = randomCountry;
    }
    for (var j = 0; j < 4; j++){
        var urlString = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + itinerary[j]['capital'] + '&key=AIzaSyAmKMy1-y559dRSIp5Kjx6gYuTp0qedv18';
        callGeocoder(urlString, j)
    }
    console.log(itinerary);
}