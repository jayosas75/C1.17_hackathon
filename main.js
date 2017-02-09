
Weglot.setup({
    api_key: 'wg_2fce281d81d90095a77029ebf6244897',
    originalLanguage: 'en',
    destinationLanguages : 'fr,es,ar,it,ko,de,ru,pt,ja,zh',
});

$(document).ready(function(){
    console.log('document ready');
    trivia_ajax_call();
    $('#trivia_btn').click(function(){
        generate_questions(trivia_obj);
        $('.modal-dialog').css('visibility', 'visible');
        $('#answer').text('');
    });
    $('#submit_trivia').click(function(){
      submit_trivia_hit();
    });
    input_click_handlers();
});

var trivia_question_counter = 0;
var trivia_question_counter_correct = 0;
var trivia_question_counter_incorrect = 0;

//function/method to initiate game

//function to disable/enable click on target country

//function/method to place carmen on map somewhere

//function to generate trivia modal

//function/method to generate trivia questions

function input_click_handlers(){
    $('#first_choice').click(function(){
        trivia_question_counter_incorrect++;
    });
    $('#second_choice').click(function(){
        console.log('correct answer hit');
        trivia_question_counter_correct++;
    });
    $('#third_choice').click(function(){
        trivia_question_counter_incorrect++;
    });
    $('#fourth_choice').click(function(){
        trivia_question_counter_incorrect++;
    });
}


function trivia_ajax_call(){
        $.ajax({
            dataType: 'json',
            url: 'proxy.php?url='+encodeURI("https://www.opentdb.com/api.php?amount=50&category=22&type=multiple"),
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
function submit_trivia_hit(){
    $("input:radio").removeAttr("checked");
    console.log('submit trivia button hit');

    if(trivia_question_counter_correct === 3){
        console.log('3 correct answers');
        //hide modal
        $('#answer').text('Three Correct, Move on!');
        setTimeout(function(){
            console.log('waiting to close modal');
        }, 4000);
        $('.modal-dialog').css('visibility', 'hidden');
        $('#trivia').css('visibility', 'hidden');
        //advance on map
        trivia_question_counter = 0;
        trivia_question_counter_incorrect = 0;
        trivia_question_counter_correct = 0;
    }
    if(trivia_question_counter_correct > 0){
        $('#answer').text('Correct');
    } else {
        $('#answer').text('Incorrect');
    }

    if(trivia_question_counter_incorrect === 3){
        //hide modal
        //lose turn/game
        trivia_question_counter = 0;
        $('#modal').modal('toggle');
    }
    trivia_question_counter++;
    $('input').prop('checked', false);
    setTimeout(generate_questions(trivia_obj), 3000);

}

//determine if trivia question is correct

//if 3 correct questions close modal and update player status and enable click on new country

//variable to track incorrect answers on trivia modal

//add click handler for

//update player status/status indicator on correct/incorrect answer


