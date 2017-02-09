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

function createMap() {
    console.log('createMap was called');

    var mapProp = {
        center: new google.maps.LatLng(initialLocation.latitude, initialLocation.longitude),
        zoom: 4
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    startMarker = new google.maps.Marker({
        position: mapProp.center
    });
    startMarker.setMap(map);
}

function markNextLocation(){
    nextMarker = new google.maps.Marker({
        position: new google.maps.LatLng(itinerary[itineraryIndex].location.lat, itinerary[itineraryIndex].location.lng)
    });
    nextMarker.setMap(map);

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


// function defaultInitialLocation(){
//     $.ajax({
//         dataType: 'json',
//         url: 'https://maps.googleapis.com/maps/api/geocode/json?address=9080%20Irvine%20Center%Dr%2C%20Irvine%2C%20CA&key=AIzaSyAmKMy1-y559dRSIp5Kjx6gYuTp0qedv18',
//         method: 'GET',
//         success: function (response) {
//             console.log('yay: ', response);
//             initialLocation = response['results'][0]['geometry'].location;
//             console.log('coords for initialLocation', initialLocation);
//         },
//         error: function (response) {
//             console.log('boo ', response);
//         }
//     });
// }
//
// function setInitialLocation() {
//     if (navigator.geolocation) {
//         console.log('geolocation attempted!!');
//         navigator.geolocation.getCurrentPosition(curPosSuccess,curPosError);
//     }
//     else {
//         console.log('starting at default HQ');
//         defaultInitialLocation();
//     }
// }
//
// function curPosSuccess(position){
//     console.log('getNavigatorObj called');
//     initialLocation = position.coords;
// }
//
// function curPosError(){
//     console.log('error with getCurrentPosition');
//     defaultInitialLocation();
// }

// function nextMap(){
//     console.log('map changed!');
//     var mapProp = {
//         center: marker2.getPosition(),
//         zoom:5
//     };
//     map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
//     marker1 = marker2;
//     marker1.setMap(map);
//     var randomX = Math.random()*100;
//     var randomY = Math.random()*100;
//     marker2 = new google.maps.Marker({
//         position:new google.maps.LatLng(randomX, randomY)
//     });
//     marker2.setMap(map);
//     marker1.addListener('click', function(){
//         map.panTo(marker2.getPosition());
//     });
// }