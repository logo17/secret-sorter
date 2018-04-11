var secrets = [];
var taggerId;

$(document).ready(function () {
  var settingsGetSecrets = {
    "async": true,
    "crossDomain": true,
    "url": "http://secretapi.andresmeza.com/api/secrets",
    "method": "GET",
    "headers": {
       "Content-Type": "application/json",
       "Cache-Control": "no-cache"
    }
  }

  $.ajax(settingsGetSecrets).done(function (response) {
    secrets = response;
    $('#btn-previous').prop('disabled', true);
    $("#secret-text").text("- " + secrets[0].value);
  });

    $("#btn-begin").click(function(){
      var sEmail = $("#user-text").val();
      if ($.trim(sEmail).length == 0) {
        $('#email-validator').show();
      }
      if (isValidEmail(sEmail)) {
        $('#email-validator').hide();
        taggerId = $("#user-text").val();
        $(".form-container").hide();
        $(".question-container").show();
      }
      else {
        $('#email-validator').show();
      }
    });

    $("#btn-previous").click(function(){
         index = parseInt($("#label-counter").text());
         if (checkAnswer()) {
           //if both questions are answered save the state
           secrets[index - 1].isInnapropiate = $('input[name=inappropriateRadio]:checked').val();
           secrets[index - 1].hasBadWords = $('input[name=badWordsRadio]:checked').val();
         }
         if (index > 1) {
           if (index - 1 == 1) {
             // disable the button in the first question
            $('#btn-previous').prop('disabled', true);
           }
           $("#label-counter").text(index - 1);
           fillSecret(index - 2);
           $('#btn-next').prop('disabled', false);
           $('#btn-finish').prop('disabled', true);
         } else {
            $('#btn-previous').prop('disabled', true);
         }
    });

    $("#btn-next").click(function(){
      index = parseInt($("#label-counter").text());
      if (checkAnswer()) {
        //if both questions are answered save the state
        secrets[index - 1].isInnapropiate = $('input[name=inappropriateRadio]:checked').val();
        secrets[index - 1].hasBadWords = $('input[name=badWordsRadio]:checked').val();
        if (index < secrets.length) {
          $("#label-counter").text(index + 1);
          fillSecret(index);
          $('#btn-previous').prop('disabled', false);
        } else {
          $('#btn-next').prop('disabled', true);
          $('#btn-finish').prop('disabled', false);
        }
      } else {
        $('#modal-text').text("Please fill the required values.");
        $('#customModal').modal('show');
      }
    });

    $("#btn-finish").click(function(){
      var tags = [];
      secrets.forEach(function(secret) {
        var tag = {
    			"SecretId" :secret.id,
    			"BadWords": (secret.hasBadWords == 'true'),
    			"Inappropriate":(secret.isInnapropiate  == 'true'),
    			"TaggerId": taggerId
        }
        tags.push(tag);
      });
      var settingsPostTags = {
        "async": true,
        "crossDomain": true,
        "data": JSON.stringify({"Results":tags}),
        "url": "http://secretapi.andresmeza.com/api/tags",
        "method": "POST",
        "headers": {
           "Content-Type": "application/json",
           "Cache-Control": "no-cache"
        }
      }

      $.ajax(settingsPostTags).done(function (response) {
        $(".question-container").hide();
        $(".result-container").show();
      }).fail(function () {
        $('#modal-text').text("There was an error trying to submit the answers.");
        $('#customModal').modal('show');
      });

    });

    function fillSecret(index) {
      $("#secret-text").text("- " + secrets[index].value);
      if (secrets[index].isInnapropiate == undefined) {
        $('input[name="inappropriateRadio"]').prop('checked', false);
      } else {
        $("input[name=inappropriateRadio][value='"+secrets[index].isInnapropiate+"']").prop("checked",true);
      }

      if (secrets[index].hasBadWords == undefined) {
        $('input[name="badWordsRadio"]').prop('checked', false);
      } else {
        $("input[name=badWordsRadio][value='"+secrets[index].hasBadWords+"']").prop("checked",true);
      }
    }

    function checkAnswer() {
      return ($('input[name=inappropriateRadio]:checked').val() === 'true' || $('input[name=inappropriateRadio]:checked').val() === 'false') &&
              ($('input[name=badWordsRadio]:checked').val() === 'true' || $('input[name=badWordsRadio]:checked').val() === 'false');
    }

    function isValidEmail(sEmail) {
      var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      if (filter.test(sEmail)) {
          return true;
      }
      else {
          return false;
      }
    }


});
