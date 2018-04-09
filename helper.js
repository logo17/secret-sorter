$(document).ready(function () {
    $("#btn-begin").click(function(){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://secretapi.andresmeza.com/api/secrets",
        "method": "GET",
        "headers": {
           "Content-Type": "application/json",
           "Cache-Control": "no-cache"
        }
      }

      $.ajax(settings).done(function (response) {
        console.log(response);
      });
      $(".form-container").hide();
      $(".question-container").show();
    });

    $("#btn-previous").click(function(){
         index = $("#label-counter").text()
         if (index > 1) {
            $("#label-counter").text(index - 1);
         } else {
            // disable button
         }
    });

    $("#btn-next").click(function(){
      index = $("#label-counter").text();
      $("#label-counter").text(index - -1);
    });


});
