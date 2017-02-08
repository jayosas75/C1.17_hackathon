$(document).ready(function(){
    console.log('document ready');
    generate_questions();
    trivia_ajax_call();
});

//function/method to initiate game

//function to disable/enable click on target country

//function/method to place carmen on map somewhere

//function to generate trivia modal

//function/method to generate trivia questions

function trivia_ajax_call(){
    $.ajax({
        dataType: 'json',
        url: 'https://www.opentdb.com/api.php?amount=50&category=22',
        method: "GET",
        success: function(results) {
            console.log('AJAX Success function called, with the following result:', results);
        },
        error: function(){
            console.log('error');
        }
    });
}

function generate_questions(){
    var question = $('#question').text('Whats my first name?');
    var label_first = $('<label for="first_choice">').text('John');
    var label_second = $('<label for="second_choice">').text('Yaeri');
    var label_third = $('<label for="third_choice">').text('Gwen');
    var label_fourth = $('<label for="fourth_choice">').text('Michael');

    $('#question_modal').append(question);

}


//determine if trivia question is correct

//if 3 correct questions close modal and update player status and enable click on new country

//variable to track incorrect answers on trivia modal

//add click handler for

//update player status/status indicator on correct/incorrect answer

