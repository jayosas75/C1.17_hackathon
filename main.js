/**
 * translation API --  translate from english to ten other languages
 */
Weglot.setup({
    api_key: 'wg_2fce281d81d90095a77029ebf6244897',
    originalLanguage: 'en',
    destinationLanguages : 'fr,es,ar,it,ko,de,ru,pt,ja,zh'
});

/**
 * on page load --  call trivia and click handlers
 */
$(document).ready(function(){
    console.log('document ready');
    trivia_ajax_call();
    $('.submit_btn').click(function(){
        submit_trivia_hit();
    });
    $('#instructions_div').modal('show');
    $('#play_btn').click(function(){
        console.log('markNextLocation');
        $('#instructions_div').modal('hide');
        markNextLocation();
    });
    generateCarmenClues();
    $('.playagain_btn').click(function (){
        console.log('reset');

    });
});

var trivia_question_counter = 0;
var trivia_question_counter_correct = 0;
var trivia_question_counter_incorrect = 0;
var last_answer = null;
var trivia_obj;
var trivia_question;
var player_correct_counter = 0;
var player_hint_counter = 0;

//function/method to initiate game
//function to disable/enable click on target country
//function/method to place carmen on map somewhere
//function to generate trivia modal
//function/method to generate trivia questions

function trivia_ajax_call(){
    $.ajax({
        dataType: 'json',
        url: 'proxy.php?url='+encodeURI("https://www.opentdb.com/api.php?amount=50") + encodeURIComponent("&type=multiple"),
        method: "GET",
        success: function(results) {
            console.log('AJAX Success function called, with the following result:', results);
            trivia_obj = results;
        },
        error: function(results){
            console.log('error', results);
        }
    });
}

function generate_questions() {
    var answer = [];
    var index = Math.floor((Math.random() * 50) + 1);

    var currentQuestion = trivia_obj['results'][index];
    var question = currentQuestion.question;

    for (var i = 0; i < 3; i++){
        answer[i] = currentQuestion.incorrect_answers[i];
    }
    answer[3] = currentQuestion.correct_answer;

    console.log('this is whatever is in answer ', answer);
    console.log('this is the question', question);

    trivia_question = {
        question: question,
        answers: answer
    };

    display_question(trivia_question);
    trivia_question_counter++;
}

function display_question(trivia_question) {
    console.log('this is the trivia_question as passed in ', trivia_question);
    var inputArray = $('input');

    console.log('this is labelArray ', inputArray);
    $('#question').text(trivia_question.question);

    for (var q = 4; q > 0; q--){
        var randomNumber = Math.floor(Math.random() * q);
        $(inputArray[randomNumber]).next().text(trivia_question.answers[q-1]);
        inputArray.splice(randomNumber, 1);
        console.log('this is the random number ', randomNumber);
        console.log('this is the current answer I want to shove in', trivia_question.answers[q-1]);
        console.log('this is the current labelArray ',inputArray);
    }
}

function submit_trivia_hit(){
    $("input:radio:checked").removeAttr("checked");
    var userAnswer = $("input:radio:checked").next().text();

    console.log('submit trivia button hit');
    console.log('this is the userAnswer ', userAnswer);

    if (userAnswer == trivia_question.answers[3]) {
        console.log('you answered correctly!');
    }else {
        console.log('you answered incorrectly!');
    }
}
function generate_questions(obj){
    var question = null;
    var answer_one = null;
    var answer_two = null;
    var answer_three = null;
    var answer_correct = null;
    for(var i = 0; i < 1; i++){
        var index = Math.floor((Math.random() * 50) +1);
        question = obj.results[index].question;
        answer_one = obj.results[index].incorrect_answers[2];
        answer_two = obj.results[index].incorrect_answers[0];
        answer_three = obj.results[index].incorrect_answers[1];
        answer_correct = obj.results[index].correct_answer;
    }
    var question_display = question;
    var first_choice = answer_two;
    var second_choice = answer_correct;
    var third_choice = answer_one;
    var fourth_choice = answer_three;
    $('#question').text(question_display);
    $('#first').text(first_choice);
    $('#second').text(second_choice);
    $('#third').text(third_choice);
    $('#fourth').text(fourth_choice);
}
//hit submit on trivia and go to next question
// function submit_trivia_hit(){
//     $("input:radio").removeAttr("checked");
//     console.log('submit trivia button hit');
//     if(trivia_question_counter_correct === 3){
//         console.log('3 correct answers');
//         setTimeout(function(){
//             console.log('waiting to close modal');
//         }, 4000);
//         //hide modal
//         $('#trivia').modal();
//         //advance on map
//         trivia_question_counter = 0;
//         trivia_question_counter_incorrect = 0;
//         trivia_question_counter_correct = 0;
//     }
//     if(last_answer === true){
//         $('.black_check').hide();
//         $('.red_check').show();
//         $('.black_x').show();
//         $('.red_x').hide();
//         setTimeout(function(){
//         }, 1000);
//         $('.black_check').show();
//     } else {
//         $('.black_check').show();
//         $('.red_check').hide();
//         $('.black_x').hide();
//         $('.red_x').show();
//         setTimeout(function(){
//         }, 1000);
//         $('.black_x').show();
//     }
//     if(trivia_question_counter_incorrect === 3){
//         //hide modal
//         //lose turn/game
//         trivia_question_counter = 0;
//         $('#lose_div').modal('toggle');
//     }
//     trivia_question_counter++;
//     $('input').prop('checked', false);
//     setTimeout(generate_questions(trivia_obj), 3000);
// }
//determine if trivia question is correct
//if 3 correct questions close modal and update player status and enable click on new country
//variable to track incorrect answers on trivia modal
//add click handler for
//update player status/status indicator on correct/incorrect answer
var itinerary = [];
var itineraryIndex = 0;
var map;
var startMarker;
var nextMarker;
var initialLocation = {
    latitude: 33.6362183,
    longitude: -117.7394721
}; //We start at LearningFuze!
callRESTCountries();
/**
 * createMap -- callback function that activates as soon as the GoogleMaps is loaded. Includes object that determines initial map properties, and also places a marker on the initial starting position
 */
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
/**
 * markNextLocation -- looks at the next object in our itinerary array and creates a marker there. also creates a click handler on the first/current marker that will pan you to the new marker
 */
function markNextLocation(){
    // if (itineraryIndex = 4){
    //     acceptFinalGuesses();
    //     return;
    // }
    nextMarker = new google.maps.Marker({
        position: new google.maps.LatLng(itinerary[itineraryIndex].location.lat, itinerary[itineraryIndex].location.lng),
        icon: 'graphics/magnifier.png'
    });
    nextMarker.setMap(map);
    startMarker.icon = 'graphics/flight.png';
    startMarker.setMap(map);

    var startMarkerListener = startMarker.addListener('click', function(){
        map.panTo(nextMarker.getPosition());
    });

    var nextMarkerListener = nextMarker.addListener('click', function(){
        $('#trivia').modal();
        generate_questions();
        startMarkerListener.remove(startMarkerListener);
        nextMarkerListener.remove(nextMarkerListener);
        startMarker = nextMarker;
    });
    itineraryIndex++;
}
/**
 * callGeocoder -- makes an ajax call to Google Maps Geocoding API to determine lat/lng for the capital cities of the countries in the itinerary and adds that info to the respective objects in the itinerary
 * @param urlString
 * @param j
 */
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
/**
 * callRESTCountries -- calls the REST Countries API to get a list of the countries that we can pull information on-- calls createItinerary in the callback to make sure it runs only after we have information to work with
 */
function callRESTCountries(){
    $.ajax({
        dataType:'json',
        url: 'https://restcountries.eu/rest/v1/all',
        method: 'GET',
        success: function(response){
            createItinerary(response);
            console.log('john: ', response)
        },
        error: function(){
            console.log('the call did not work...');
        }
    })
}
/**
 * createItinerary -- randomly picks four countries from the countriesArray  pulles from RESTCountries
 */
function createItinerary(response){
    console.log('createItinerary called');
    for (var i = 0; i < 4; i++){
        var randomNumber = Math.floor(Math.random()*251);
        var randomCountry = response[randomNumber];
        itinerary[i] = randomCountry;
    }
    for (var j = 0; j < 4; j++){
        var urlString = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + itinerary[j]['capital'] + '&key=AIzaSyAmKMy1-y559dRSIp5Kjx6gYuTp0qedv18';
        callGeocoder(urlString, j)
    }
    console.log(itinerary);
}
/**
 * acceptFinalGuesses -- initiates the final mode of the game where the user can input clicks onto the map to guess where carmen sandiego is by creating a listener on the whole map for a click
 */
function acceptFinalGuesses(){
    map.addListener('click', function(e){
        console.log('a guess was made!');
        didWeFindHer(e);
    });
}
/**
 * didWeFindHer -- checks if the user's guess is within a certain distance of carmen sandiego's actual location
 * @param e
 */
function didWeFindHer(e){
    console.log('this is e', e);
    var userGuess = e.latLng;
    var herLocation = new google.maps.LatLng(itinerary[3].location.lat, itinerary[3].location.lng);
    console.log('this is herLocation', herLocation);
    console.log('this is the userGuess obj: ', userGuess);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(userGuess, herLocation);
    console.log('this is the distance to carmen sandiego! ', distance);
    if (distance < 500000){
        console.log('you got her!');
        $('#win_div').modal('show');
    }
    else{
        console.log('keep trying! she always goes to a capital!');
        $('#lose_div').modal('show');
    }
}

/**
 * generateCarmenClues -- pull information from the itinerary to generate carmen clues for the final win
 */

var carmenCluesArray = [];
var cluePropertyArray = ['population', 'languages', 'region', 'subregion', 'timezone', 'currency', 'borders', 'topLevelDomain','capital'];

function generateCarmenClues(){

    var clueTemplateArray =[
        "It seems like the country that Carmen's heading to has a population around " + itinerary[3]['population'] + ".",
        "It looks like Carmen dropped a scrap of paper. The words on it look like they're in : " + itinerary[3]['languages'] + ".",
        "It seems like Carmen's heading off somewhere in " + itinerary[3]['region'] + ".",
        "Hm... it seems like Carmen's heading to somewhere in " + itinerary[3]['subregion'] + ".",
        "Looks like Carmen dropped her watch. Going by my calculations, her watch is set for " + itinerary[3]['timezone'] + " time zone.",
        "A few bills fell out of Carmen's pocket! Looks like they are " + itinerary[3]['currency'] + ".",
        "She dropped a scrap of paper with a country crossed off! Maybe" + itinerary[3]['borders'] + " this is near where she's headed!",
        "Carmen dropped yet another scrap of paper with a URL on it. I can't quite make out the URL, but the top-level domain is " + itinerary[3]['topLevelDomain'] + "!",
        "She dropped a tourism brochure. She's headed to " + itinerary[3]['capital'] + "!"];

     for (var q = 0; q < 9 ; q++) {
         carmenCluesArray[q] = clueTemplateArray[q];
     }
    console.log('Carmen Clues! ', carmenCluesArray);
}

function display_hints() {
    //display right after u beat country
    $('#question').hide();
    $('input').hide();
    $('label').hide();
    create_p_for_hints();
    if (player_hint_counter === 1) {
        $('.hints1').text(carmenCluesArray[0]);
    } else if(player_hint_counter === 2) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
    } else if(player_hint_counter === 3) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
        $('.hints3').text(carmenCluesArray[2]);
    } else if(player_hint_counter === 4) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
        $('.hints3').text(carmenCluesArray[2]);
        $('.hints4').text(carmenCluesArray[3]);
    } else if(player_hint_counter === 5) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
        $('.hints3').text(carmenCluesArray[2]);
        $('.hints4').text(carmenCluesArray[3]);
        $('.hints5').text(carmenCluesArray[4]);
    } else if(player_hint_counter === 6) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
        $('.hints3').text(carmenCluesArray[2]);
        $('.hints4').text(carmenCluesArray[3]);
        $('.hints5').text(carmenCluesArray[4]);
        $('.hints6').text(carmenCluesArray[5]);
    } else if(player_hint_counter === 7) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
        $('.hints3').text(carmenCluesArray[2]);
        $('.hints4').text(carmenCluesArray[3]);
        $('.hints5').text(carmenCluesArray[4]);
        $('.hints6').text(carmenCluesArray[5]);
        $('.hints7').text(carmenCluesArray[6]);
    } else if(player_hint_counter === 8) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
        $('.hints3').text(carmenCluesArray[2]);
        $('.hints4').text(carmenCluesArray[3]);
        $('.hints5').text(carmenCluesArray[4]);
        $('.hints6').text(carmenCluesArray[5]);
        $('.hints7').text(carmenCluesArray[6]);
        $('.hints8').text(carmenCluesArray[7]);
    } else if(player_hint_counter === 9) {
        $('.hints1').text(carmenCluesArray[0]);
        $('.hints2').text(carmenCluesArray[1]);
        $('.hints3').text(carmenCluesArray[2]);
        $('.hints4').text(carmenCluesArray[3]);
        $('.hints5').text(carmenCluesArray[4]);
        $('.hints6').text(carmenCluesArray[5]);
        $('.hints7').text(carmenCluesArray[6]);
        $('.hints8').text(carmenCluesArray[7]);
        $('.hints9').text(carmenCluesArray[8]);
    }
}

function create_p_for_hints(){
    var new_p1 = $('<p>').addClass('hints1');
    var new_p2 = $('<p>').addClass('hints2');
    var new_p3 = $('<p>').addClass('hints3');
    var new_p4 = $('<p>').addClass('hints4');
    var new_p5 = $('<p>').addClass('hints5');
    var new_p6 = $('<p>').addClass('hints6');
    var new_p7 = $('<p>').addClass('hints7');
    var new_p8 = $('<p>').addClass('hints8');
    var new_p9 = $('<p>').addClass('hints9');
    $('.modal-body').append(new_p1, new_p2, new_p3, new_p4, new_p5, new_p6, new_p7, new_p8, new_p9);
}