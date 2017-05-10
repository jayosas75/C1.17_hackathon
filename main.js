// Weglot.setup({
//     api_key: 'wg_2fce281d81d90095a77029ebf6244897',
//     originalLanguage: 'en',
//     destinationLanguages : 'fr,es,ar,it,ko,de,ru,pt,ja,zh'
// });

callRESTCountries();

$(document).ready(function(){
    trivia_ajax_call();
    $('.submit_btn').click(function(){
        submit_trivia_hit();
    });
    $('#instructions_div').modal({backdrop: false, keyboard: false});
    $('#play_btn').click(function(){
        $('.post_country_win').hide();
        $('#instructions_div').hide();
        $('#hints-div').hide();
        // markNextLocation();
    });
    // $('.playagain_btn').click(function (){
    // });
    // $('.post_country_win').click(function(){
    //     move_onto_next_country()});
});

var trivia_question_counter = 0;
var trivia_obj;
var trivia_question;
var player_hint_counter = 0;

function trivia_ajax_call(){
    $.ajax({
        dataType: 'json',
        url: 'proxy.php?url='+encodeURI("https://www.opentdb.com/api.php?amount=50") + encodeURIComponent("&type=multiple") +encodeURIComponent("&encode=url3986") +encodeURIComponent("&category=9") ,
        method: "GET",
        success: function(results) {
            trivia_obj = results;
        },
        error: function(results){
            console.log('error', results);
        }
    });
}

function generate_questions() {
    var index = Math.floor((Math.random() * (trivia_obj['results'].length)) + 1);
    var currentQuestion = trivia_obj['results'].splice(index, 1);
    currentQuestion = currentQuestion[0]
    var question = currentQuestion.question || generate_questions();
    var answer = currentQuestion.incorrect_answers.slice(0);
    answer.push(currentQuestion.correct_answer);

    trivia_question = {
        question: question,
        answers: answer
    };

    display_question(trivia_question);
    trivia_question_counter++;
}

function move_onto_next_country(){
    $('#trivia').modal();
    $('#hints-div').hide();
    //REMEMBER TO CHANGE THIS BACK TO 3
    if (itineraryIndex >= 3){
        $('#trivia').hide();
        acceptFinalGuesses();
        return;
    }
    $('#trivia').hide();
    $('.post_country_win').hide();
    // $('#hints-div').hide();
    $('.submit_btn').show();
    reset_trivia_div_for_question();
    markNextLocation();
}
function display_question(trivia_question) {
    $('#question').text(decodeURIComponent(trivia_question.question));
    var randomizedAnswers = [];
    var triviaAnswers = trivia_question.answers.slice(0);
    while (triviaAnswers.length > 0){
        randomizedAnswers.push(triviaAnswers.splice(Math.floor(triviaAnswers.length * Math.random()), 1).join())    
    }
    $('input').each(function(index, domEle){
        $(domEle).next().text(decodeURIComponent(randomizedAnswers[index]))
    })
}

function submit_trivia_hit(){
    var userAnswer = $("input:radio:checked").next().text();
    $("input:radio:checked").attr("checked", false);

    var correctAnswer = decodeURIComponent(trivia_question.answers[3]);

    if (userAnswer == correctAnswer) {
        player_hint_counter++;
        $('.black_check').hide();
        $('.red_check').show();
        $('.black_x').show();
        $('.red_x').hide();
        setTimeout(function() {
            $('.red_check').hide();
            $('.black_check').show();
            endCountryTriviaCheck();
            generate_questions();
        }, 1000);
    }else {
        $('.black_check').show();
        $('.red_check').hide();
        $('.black_x').hide();
        $('.red_x').show();
        setTimeout(function() {
            $('.black_x').show();
            $('.red_x').hide();
            endCountryTriviaCheck();
            generate_questions();
        }, 1000);
    }
}

function endCountryTriviaCheck(){
    if(trivia_question_counter === 3){
        $('.submit_btn').hide();
        $('.black_check').hide();
        $('.red_check').hide();
        $('.black_x').hide();
        $('.red_x').hide();
        display_hints();
        $('.post_country_win').show();
        trivia_question_counter = 0;
        scoreTracker();
    }
}

var itinerary = [];
var itineraryIndex = 0;
var map;
var wrong_guesses = 0;
var startMarker;
var nextMarker;
var initialLocation = {
    latitude: 33.6362183,
    longitude: -117.7394721
}; //We start at LearningFuze!


/**
 * createMap -- callback function that activates as soon as the GoogleMaps is loaded. Includes object that determines initial map properties, and also places a marker on the initial starting position
 */
function createMap() {
    var mapProp = {
        center: new google.maps.LatLng(initialLocation.latitude, initialLocation.longitude),
        zoom: 5,
        zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
        }
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
    if (itinerary[itineraryIndex].location){
        nextMarker = new google.maps.Marker({
        position: new google.maps.LatLng(itinerary[itineraryIndex].location.lat, itinerary[itineraryIndex].location.lng),
        icon: 'graphics/magnifier.png'
        });
    }else{
        nextMarker = new google.maps.Marker({
        position: new google.maps.LatLng(itinerary[itineraryIndex].latlng[0], itinerary[itineraryIndex].latlng[0]),
        icon: 'graphics/magnifier.png'
        });
    }
    
    if (itineraryIndex < 3) {
        nextMarker.setMap(map);
    }
    startMarker.icon = 'graphics/flight.png';
    startMarker.setMap(map);

    var startMarkerListener = startMarker.addListener('click', function(){
        map.panTo(nextMarker.getPosition());
    });

    var nextMarkerListener = nextMarker.addListener('click', function(){
        countriesTracker();
        $('#trivia').modal({backdrop: "static", keyboard: false}).show();

        trivia_question_counter = 0;
        generate_questions();
        startMarkerListener.remove(startMarkerListener);
        nextMarkerListener.remove(nextMarkerListener);
        startMarker.icon ='graphics/checkmark-for-verification.png';
        startMarker.setMap(map);
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
            itinerary[j].location = response.results[0]['geometry'].location;
            if (j === 3){
                markNextLocation(); 
            }
        },
        error: function (response) {
            console.log('boo ', response);
            callRESTCountries();
            
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
        },
        error: function(){
            console.log('could not reach REST Countries');
        }
    })
}
/**
 * createItinerary -- randomly picks four countries from the countriesArray  pulles from RESTCountries
 */
function createItinerary(response){
    var countryCount = 251;
    for (var i = 0; i < 4; i++){
        var randomNumber = Math.floor(Math.random()*countryCount--);
        var randomCountry = response.splice(randomNumber, 1);
        itinerary[i] = randomCountry[0];
    }
    if (itinerary[0] === undefined){
        var randomNumber = Math.floor(Math.random()*countryCount--);
        var randomCountry = response.splice(randomNumber, 1).join();
        itinerary[0] = randomCountry[0];
    }
    for (var j = 0; j < 4; j++){
        var urlString = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + itinerary[j]['capital'] + '&key=AIzaSyAmKMy1-y559dRSIp5Kjx6gYuTp0qedv18';
        callGeocoder(urlString, j)
    }
    generateCarmenClues();
}
/**
 * acceptFinalGuesses -- initiates the final mode of the game where the user can input clicks onto the map to guess where carmen sandiego is by creating a listener on the whole map for a click
 */
function acceptFinalGuesses(){
    startMarker.icon ='graphics/checkmark-for-verification.png';
    nextMarker.icon ='graphics/checkmark-for-verification.png';
    setTimeout(function(){
        $("#final-phase").modal({backdrop: "static", keyboard: false});
    }, 500);
    map.addListener('click', function(e){
        didWeFindHer(e);
    });
}
/**
 * didWeFindHer -- checks if the user's guess is within a certain distance of carmen sandiego's actual location
 * @param e
 */
function didWeFindHer(e){
    var userGuess = e.latLng;
    var herLocation = new google.maps.LatLng(itinerary[3].location.lat, itinerary[3].location.lng);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(userGuess, herLocation);
    if (distance < 500000){
        console.log('you win!')
        $('#real_win').modal({background: "static", keyboard: false});
        return;
    }
    else{
        if(wrong_guesses > 4){
            $('#loss-modal').modal({background: "static", keyboard: false})    
            $('#loss-modal p').text('Dang! She got away. I\'ll get you next time, Carmen Sandiego!')
            return;
        }
        wrong_guesses++;
        // alert('keep trying! Hint: She always goes to a capital city!');
        $('#wrong-guess').modal({background: "static", keyboard: false})
        $('#wrong-guess p').text("Our scanners tell us she's still " + distance + "meters away. \n Hint: She always goes to a capital city!");
    }
}

/**
 * generateCarmenClues -- pull information from the itinerary to generate carmen clues for the final win
 */

var carmenCluesArray = [];
var cluePropertyArray = ['population', 'languages', 'region', 'subregion', 'timezone', 'currency', 'borders', 'topLevelDomain','capital'];

function generateCarmenClues(){
    convertLangCodes();

    var clueTemplateArray =[
        "It seems like the country that Carmen's heading to has a population around " + itinerary[3]['population'] + ".",
        "It looks like Carmen dropped a scrap of paper. The words on it look like they're in " + itinerary[3]['languages'] + ".",
        "It seems like Carmen's heading off somewhere in " + itinerary[3]['region'] + ".",
        "Hm... it seems like Carmen's heading to somewhere in " + itinerary[3]['subregion'] + ".",
        "Looks like Carmen dropped her watch. Going by my calculations, her watch is set for " + itinerary[3]['timezones'] + " time zone.",
        "A few bills fell out of Carmen's pocket! Looks like they are " + itinerary[3]['currency'] || itinerary[3]['currencies'] + ".",
        "She dropped a scrap of paper with a country crossed off! Maybe" + itinerary[3]['borders'] + " this is near where she's headed!",
        "Carmen dropped yet another scrap of paper with a URL on it. I can't quite make out the URL, but the top-level domain is " + itinerary[3]['topLevelDomain'] + "!",
        "She dropped a tourism brochure. She's headed to " + itinerary[3]['capital'] + "!"];

    for (var q = 0; q < 9 ; q++) {
        carmenCluesArray[q] = clueTemplateArray[q];
    }
}

function convertLangCodes(){
    for (var w = 0; w < 4; w++){
        itinerary[w]['languages'] = isoLangs[itinerary[w]['languages'][0]].name;
    }
}

function display_hints() {
    //display right after u beat country
    $('.black_check').hide();
    $('.red_check').hide();
    $('.black_x').hide();
    $('.red_x').hide();
    $('#question').hide();
    $('input').hide();
    $('label').hide();
    var hints = []
    for (var i = 0; i < player_hint_counter; i++){
        hints.push($('<p></p>').text(carmenCluesArray[i]))
    }
    console.log('hints', hints)
    $('#hints-div').html('')
    hints.reverse().map(function(p){
        $("#hints-div").prepend(p)}) 
    $("#hints-div").show();
}

function reset_trivia_div_for_question(){
    $('#question').show();
    $('input').show();
    $('label').show();
    $('.black_check').show();
    $('.red_check').hide();
    $('.black_x').show();
    $('.red_x').hide();
}

/**
 * countriesTracker -- add countries to the country tracker as they are visited
 */

function countriesTracker(){
    var newCountry = $('<li>').text(itinerary[itineraryIndex - 1].name);
    $('ul').append(newCountry);
}

/**
 * scoreTracker -- update the score as questions are answered.
 */
function scoreTracker(){
    $('.to').text(player_hint_counter + ' clues gathered!');
}
function reloadPage(){
    document.location.reload();
}
var isoLangs = {
    "ab":{
        "name":"Abkhaz",
        "nativeName":"аҧсуа"
    },
    "aa":{
        "name":"Afar",
        "nativeName":"Afaraf"
    },
    "af":{
        "name":"Afrikaans",
        "nativeName":"Afrikaans"
    },
    "ak":{
        "name":"Akan",
        "nativeName":"Akan"
    },
    "sq":{
        "name":"Albanian",
        "nativeName":"Shqip"
    },
    "am":{
        "name":"Amharic",
        "nativeName":"አማርኛ"
    },
    "ar":{
        "name":"Arabic",
        "nativeName":"العربية"
    },
    "an":{
        "name":"Aragonese",
        "nativeName":"Aragonés"
    },
    "hy":{
        "name":"Armenian",
        "nativeName":"Հայերեն"
    },
    "as":{
        "name":"Assamese",
        "nativeName":"অসমীয়া"
    },
    "av":{
        "name":"Avaric",
        "nativeName":"авар мацӀ, магӀарул мацӀ"
    },
    "ae":{
        "name":"Avestan",
        "nativeName":"avesta"
    },
    "ay":{
        "name":"Aymara",
        "nativeName":"aymar aru"
    },
    "az":{
        "name":"Azerbaijani",
        "nativeName":"azərbaycan dili"
    },
    "bm":{
        "name":"Bambara",
        "nativeName":"bamanankan"
    },
    "ba":{
        "name":"Bashkir",
        "nativeName":"башҡорт теле"
    },
    "eu":{
        "name":"Basque",
        "nativeName":"euskara, euskera"
    },
    "be":{
        "name":"Belarusian",
        "nativeName":"Беларуская"
    },
    "bn":{
        "name":"Bengali",
        "nativeName":"বাংলা"
    },
    "bh":{
        "name":"Bihari",
        "nativeName":"भोजपुरी"
    },
    "bi":{
        "name":"Bislama",
        "nativeName":"Bislama"
    },
    "bs":{
        "name":"Bosnian",
        "nativeName":"bosanski jezik"
    },
    "br":{
        "name":"Breton",
        "nativeName":"brezhoneg"
    },
    "bg":{
        "name":"Bulgarian",
        "nativeName":"български език"
    },
    "my":{
        "name":"Burmese",
        "nativeName":"ဗမာစာ"
    },
    "ca":{
        "name":"Catalan; Valencian",
        "nativeName":"Català"
    },
    "ch":{
        "name":"Chamorro",
        "nativeName":"Chamoru"
    },
    "ce":{
        "name":"Chechen",
        "nativeName":"нохчийн мотт"
    },
    "ny":{
        "name":"Chichewa; Chewa; Nyanja",
        "nativeName":"chiCheŵa, chinyanja"
    },
    "zh":{
        "name":"Chinese",
        "nativeName":"中文 (Zhōngwén), 汉语, 漢語"
    },
    "cv":{
        "name":"Chuvash",
        "nativeName":"чӑваш чӗлхи"
    },
    "kw":{
        "name":"Cornish",
        "nativeName":"Kernewek"
    },
    "co":{
        "name":"Corsican",
        "nativeName":"corsu, lingua corsa"
    },
    "cr":{
        "name":"Cree",
        "nativeName":"ᓀᐦᐃᔭᐍᐏᐣ"
    },
    "hr":{
        "name":"Croatian",
        "nativeName":"hrvatski"
    },
    "cs":{
        "name":"Czech",
        "nativeName":"česky, čeština"
    },
    "da":{
        "name":"Danish",
        "nativeName":"dansk"
    },
    "dv":{
        "name":"Divehi; Dhivehi; Maldivian;",
        "nativeName":"ދިވެހި"
    },
    "nl":{
        "name":"Dutch",
        "nativeName":"Nederlands, Vlaams"
    },
    "en":{
        "name":"English",
        "nativeName":"English"
    },
    "eo":{
        "name":"Esperanto",
        "nativeName":"Esperanto"
    },
    "et":{
        "name":"Estonian",
        "nativeName":"eesti, eesti keel"
    },
    "ee":{
        "name":"Ewe",
        "nativeName":"Eʋegbe"
    },
    "fo":{
        "name":"Faroese",
        "nativeName":"føroyskt"
    },
    "fj":{
        "name":"Fijian",
        "nativeName":"vosa Vakaviti"
    },
    "fi":{
        "name":"Finnish",
        "nativeName":"suomi, suomen kieli"
    },
    "fr":{
        "name":"French",
        "nativeName":"français, langue française"
    },
    "ff":{
        "name":"Fula; Fulah; Pulaar; Pular",
        "nativeName":"Fulfulde, Pulaar, Pular"
    },
    "gl":{
        "name":"Galician",
        "nativeName":"Galego"
    },
    "ka":{
        "name":"Georgian",
        "nativeName":"ქართული"
    },
    "de":{
        "name":"German",
        "nativeName":"Deutsch"
    },
    "el":{
        "name":"Greek, Modern",
        "nativeName":"Ελληνικά"
    },
    "gn":{
        "name":"Guaraní",
        "nativeName":"Avañeẽ"
    },
    "gu":{
        "name":"Gujarati",
        "nativeName":"ગુજરાતી"
    },
    "ht":{
        "name":"Haitian; Haitian Creole",
        "nativeName":"Kreyòl ayisyen"
    },
    "ha":{
        "name":"Hausa",
        "nativeName":"Hausa, هَوُسَ"
    },
    "he":{
        "name":"Hebrew (modern)",
        "nativeName":"עברית"
    },
    "hz":{
        "name":"Herero",
        "nativeName":"Otjiherero"
    },
    "hi":{
        "name":"Hindi",
        "nativeName":"हिन्दी, हिंदी"
    },
    "ho":{
        "name":"Hiri Motu",
        "nativeName":"Hiri Motu"
    },
    "hu":{
        "name":"Hungarian",
        "nativeName":"Magyar"
    },
    "ia":{
        "name":"Interlingua",
        "nativeName":"Interlingua"
    },
    "id":{
        "name":"Indonesian",
        "nativeName":"Bahasa Indonesia"
    },
    "ie":{
        "name":"Interlingue",
        "nativeName":"Originally called Occidental; then Interlingue after WWII"
    },
    "ga":{
        "name":"Irish",
        "nativeName":"Gaeilge"
    },
    "ig":{
        "name":"Igbo",
        "nativeName":"Asụsụ Igbo"
    },
    "ik":{
        "name":"Inupiaq",
        "nativeName":"Iñupiaq, Iñupiatun"
    },
    "io":{
        "name":"Ido",
        "nativeName":"Ido"
    },
    "is":{
        "name":"Icelandic",
        "nativeName":"Íslenska"
    },
    "it":{
        "name":"Italian",
        "nativeName":"Italiano"
    },
    "iu":{
        "name":"Inuktitut",
        "nativeName":"ᐃᓄᒃᑎᑐᑦ"
    },
    "ja":{
        "name":"Japanese",
        "nativeName":"日本語 (にほんご／にっぽんご)"
    },
    "jv":{
        "name":"Javanese",
        "nativeName":"basa Jawa"
    },
    "kl":{
        "name":"Kalaallisut, Greenlandic",
        "nativeName":"kalaallisut, kalaallit oqaasii"
    },
    "kn":{
        "name":"Kannada",
        "nativeName":"ಕನ್ನಡ"
    },
    "kr":{
        "name":"Kanuri",
        "nativeName":"Kanuri"
    },
    "ks":{
        "name":"Kashmiri",
        "nativeName":"कश्मीरी, كشميري‎"
    },
    "kk":{
        "name":"Kazakh",
        "nativeName":"Қазақ тілі"
    },
    "km":{
        "name":"Khmer",
        "nativeName":"ភាសាខ្មែរ"
    },
    "ki":{
        "name":"Kikuyu, Gikuyu",
        "nativeName":"Gĩkũyũ"
    },
    "rw":{
        "name":"Kinyarwanda",
        "nativeName":"Ikinyarwanda"
    },
    "ky":{
        "name":"Kirghiz, Kyrgyz",
        "nativeName":"кыргыз тили"
    },
    "kv":{
        "name":"Komi",
        "nativeName":"коми кыв"
    },
    "kg":{
        "name":"Kongo",
        "nativeName":"KiKongo"
    },
    "ko":{
        "name":"Korean",
        "nativeName":"한국어 (韓國語), 조선말 (朝鮮語)"
    },
    "ku":{
        "name":"Kurdish",
        "nativeName":"Kurdî, كوردی‎"
    },
    "kj":{
        "name":"Kwanyama, Kuanyama",
        "nativeName":"Kuanyama"
    },
    "la":{
        "name":"Latin",
        "nativeName":"latine, lingua latina"
    },
    "lb":{
        "name":"Luxembourgish, Letzeburgesch",
        "nativeName":"Lëtzebuergesch"
    },
    "lg":{
        "name":"Luganda",
        "nativeName":"Luganda"
    },
    "li":{
        "name":"Limburgish, Limburgan, Limburger",
        "nativeName":"Limburgs"
    },
    "ln":{
        "name":"Lingala",
        "nativeName":"Lingála"
    },
    "lo":{
        "name":"Lao",
        "nativeName":"ພາສາລາວ"
    },
    "lt":{
        "name":"Lithuanian",
        "nativeName":"lietuvių kalba"
    },
    "lu":{
        "name":"Luba-Katanga",
        "nativeName":""
    },
    "lv":{
        "name":"Latvian",
        "nativeName":"latviešu valoda"
    },
    "gv":{
        "name":"Manx",
        "nativeName":"Gaelg, Gailck"
    },
    "mk":{
        "name":"Macedonian",
        "nativeName":"македонски јазик"
    },
    "mg":{
        "name":"Malagasy",
        "nativeName":"Malagasy fiteny"
    },
    "ms":{
        "name":"Malay",
        "nativeName":"bahasa Melayu, بهاس ملايو‎"
    },
    "ml":{
        "name":"Malayalam",
        "nativeName":"മലയാളം"
    },
    "mt":{
        "name":"Maltese",
        "nativeName":"Malti"
    },
    "mi":{
        "name":"Māori",
        "nativeName":"te reo Māori"
    },
    "mr":{
        "name":"Marathi (Marāṭhī)",
        "nativeName":"मराठी"
    },
    "mh":{
        "name":"Marshallese",
        "nativeName":"Kajin M̧ajeļ"
    },
    "mn":{
        "name":"Mongolian",
        "nativeName":"монгол"
    },
    "na":{
        "name":"Nauru",
        "nativeName":"Ekakairũ Naoero"
    },
    "nv":{
        "name":"Navajo, Navaho",
        "nativeName":"Diné bizaad, Dinékʼehǰí"
    },
    "nb":{
        "name":"Norwegian Bokmål",
        "nativeName":"Norsk bokmål"
    },
    "nd":{
        "name":"North Ndebele",
        "nativeName":"isiNdebele"
    },
    "ne":{
        "name":"Nepali",
        "nativeName":"नेपाली"
    },
    "ng":{
        "name":"Ndonga",
        "nativeName":"Owambo"
    },
    "nn":{
        "name":"Norwegian Nynorsk",
        "nativeName":"Norsk nynorsk"
    },
    "no":{
        "name":"Norwegian",
        "nativeName":"Norsk"
    },
    "ii":{
        "name":"Nuosu",
        "nativeName":"ꆈꌠ꒿ Nuosuhxop"
    },
    "nr":{
        "name":"South Ndebele",
        "nativeName":"isiNdebele"
    },
    "oc":{
        "name":"Occitan",
        "nativeName":"Occitan"
    },
    "oj":{
        "name":"Ojibwe, Ojibwa",
        "nativeName":"ᐊᓂᔑᓈᐯᒧᐎᓐ"
    },
    "cu":{
        "name":"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
        "nativeName":"ѩзыкъ словѣньскъ"
    },
    "om":{
        "name":"Oromo",
        "nativeName":"Afaan Oromoo"
    },
    "or":{
        "name":"Oriya",
        "nativeName":"ଓଡ଼ିଆ"
    },
    "os":{
        "name":"Ossetian, Ossetic",
        "nativeName":"ирон æвзаг"
    },
    "pa":{
        "name":"Panjabi, Punjabi",
        "nativeName":"ਪੰਜਾਬੀ, پنجابی‎"
    },
    "pi":{
        "name":"Pāli",
        "nativeName":"पाऴि"
    },
    "fa":{
        "name":"Persian",
        "nativeName":"فارسی"
    },
    "pl":{
        "name":"Polish",
        "nativeName":"polski"
    },
    "ps":{
        "name":"Pashto, Pushto",
        "nativeName":"پښتو"
    },
    "pt":{
        "name":"Portuguese",
        "nativeName":"Português"
    },
    "qu":{
        "name":"Quechua",
        "nativeName":"Runa Simi, Kichwa"
    },
    "rm":{
        "name":"Romansh",
        "nativeName":"rumantsch grischun"
    },
    "rn":{
        "name":"Kirundi",
        "nativeName":"kiRundi"
    },
    "ro":{
        "name":"Romanian, Moldavian, Moldovan",
        "nativeName":"română"
    },
    "ru":{
        "name":"Russian",
        "nativeName":"русский язык"
    },
    "sa":{
        "name":"Sanskrit (Saṁskṛta)",
        "nativeName":"संस्कृतम्"
    },
    "sc":{
        "name":"Sardinian",
        "nativeName":"sardu"
    },
    "sd":{
        "name":"Sindhi",
        "nativeName":"सिन्धी, سنڌي، سندھی‎"
    },
    "se":{
        "name":"Northern Sami",
        "nativeName":"Davvisámegiella"
    },
    "sm":{
        "name":"Samoan",
        "nativeName":"gagana faa Samoa"
    },
    "sg":{
        "name":"Sango",
        "nativeName":"yângâ tî sängö"
    },
    "sr":{
        "name":"Serbian",
        "nativeName":"српски језик"
    },
    "gd":{
        "name":"Scottish Gaelic; Gaelic",
        "nativeName":"Gàidhlig"
    },
    "sn":{
        "name":"Shona",
        "nativeName":"chiShona"
    },
    "si":{
        "name":"Sinhala, Sinhalese",
        "nativeName":"සිංහල"
    },
    "sk":{
        "name":"Slovak",
        "nativeName":"slovenčina"
    },
    "sl":{
        "name":"Slovene",
        "nativeName":"slovenščina"
    },
    "so":{
        "name":"Somali",
        "nativeName":"Soomaaliga, af Soomaali"
    },
    "st":{
        "name":"Southern Sotho",
        "nativeName":"Sesotho"
    },
    "es":{
        "name":"Spanish; Castilian",
        "nativeName":"español, castellano"
    },
    "su":{
        "name":"Sundanese",
        "nativeName":"Basa Sunda"
    },
    "sw":{
        "name":"Swahili",
        "nativeName":"Kiswahili"
    },
    "ss":{
        "name":"Swati",
        "nativeName":"SiSwati"
    },
    "sv":{
        "name":"Swedish",
        "nativeName":"svenska"
    },
    "ta":{
        "name":"Tamil",
        "nativeName":"தமிழ்"
    },
    "te":{
        "name":"Telugu",
        "nativeName":"తెలుగు"
    },
    "tg":{
        "name":"Tajik",
        "nativeName":"тоҷикӣ, toğikī, تاجیکی‎"
    },
    "th":{
        "name":"Thai",
        "nativeName":"ไทย"
    },
    "ti":{
        "name":"Tigrinya",
        "nativeName":"ትግርኛ"
    },
    "bo":{
        "name":"Tibetan Standard, Tibetan, Central",
        "nativeName":"བོད་ཡིག"
    },
    "tk":{
        "name":"Turkmen",
        "nativeName":"Türkmen, Түркмен"
    },
    "tl":{
        "name":"Tagalog",
        "nativeName":"Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"
    },
    "tn":{
        "name":"Tswana",
        "nativeName":"Setswana"
    },
    "to":{
        "name":"Tonga (Tonga Islands)",
        "nativeName":"faka Tonga"
    },
    "tr":{
        "name":"Turkish",
        "nativeName":"Türkçe"
    },
    "ts":{
        "name":"Tsonga",
        "nativeName":"Xitsonga"
    },
    "tt":{
        "name":"Tatar",
        "nativeName":"татарча, tatarça, تاتارچا‎"
    },
    "tw":{
        "name":"Twi",
        "nativeName":"Twi"
    },
    "ty":{
        "name":"Tahitian",
        "nativeName":"Reo Tahiti"
    },
    "ug":{
        "name":"Uighur, Uyghur",
        "nativeName":"Uyƣurqə, ئۇيغۇرچە‎"
    },
    "uk":{
        "name":"Ukrainian",
        "nativeName":"українська"
    },
    "ur":{
        "name":"Urdu",
        "nativeName":"اردو"
    },
    "uz":{
        "name":"Uzbek",
        "nativeName":"zbek, Ўзбек, أۇزبېك‎"
    },
    "ve":{
        "name":"Venda",
        "nativeName":"Tshivenḓa"
    },
    "vi":{
        "name":"Vietnamese",
        "nativeName":"Tiếng Việt"
    },
    "vo":{
        "name":"Volapük",
        "nativeName":"Volapük"
    },
    "wa":{
        "name":"Walloon",
        "nativeName":"Walon"
    },
    "cy":{
        "name":"Welsh",
        "nativeName":"Cymraeg"
    },
    "wo":{
        "name":"Wolof",
        "nativeName":"Wollof"
    },
    "fy":{
        "name":"Western Frisian",
        "nativeName":"Frysk"
    },
    "xh":{
        "name":"Xhosa",
        "nativeName":"isiXhosa"
    },
    "yi":{
        "name":"Yiddish",
        "nativeName":"ייִדיש"
    },
    "yo":{
        "name":"Yoruba",
        "nativeName":"Yorùbá"
    },
    "za":{
        "name":"Zhuang, Chuang",
        "nativeName":"Saɯ cueŋƅ, Saw cuengh"
    }
};