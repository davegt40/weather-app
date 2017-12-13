var varLatitude;
var varLongitude;
var finalURL;
var convertTemp = false;

$(document).ready(function() {
  
  $(function() {
    $('#toggle-event').change(function() {
      convertTemp = !(convertTemp);
    })
  })
  
  function convertToFarenheit (celsius) {
    return Math.round((celsius * 9/5) + 32)
  }
  
  $("#getweather").on("click", function() {
    $("#loading-container").show()
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      varLatitude = crd.latitude;
      varLongitude = crd.longitude;
    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
    
    var apiURL = 'https://simple-weather.p.mashape.com/weatherdata';
    finalURL = apiURL + '?lat=' + varLatitude + '&lng=' + varLongitude;
    
    $.ajax({
      url: finalURL,
      headers: { 'X-Mashape-Key': 'UtXuv6lCeTmshLcTVzyvRdAYyfgEp1g1phljsnQ6Z5SyOWtMVP' },
      success: function (data) {
        var response = jQuery.parseJSON(data);
        console.log(response);
        
        $("#location")
          .html( "Location: " +  response['query']['results']['channel']['location']['city']
                + ", "
                + response['query']['results']['channel']['location']['region']
                + " "
                + response['query']['results']['channel']['location']['country'])
        
        var temperature;
        if (convertTemp) {
          temperature = convertToFarenheit(response['query']['results']['channel']['item']['condition']['temp']);
        } else {
          temperature = response['query']['results']['channel']['item']['condition']['temp'];
        }
        
        $("#temperature")
          .html( "Temperature: " +  temperature)
        
        var conditionImage = "http://l.yimg.com/a/i/us/we/52/" + response['query']['results']['channel']['item']['condition']['code'] + ".gif";
        
        $("#condition")
          .html( "Condition: " +  response['query']['results']['channel']['item']['condition']['text']
               + "</br><img src=\"" + conditionImage + "\"></img>"
               + "</br>Humidity: " + response['query']['results']['channel']['atmosphere']['humidity']
               + "</br>Visibility: " + response['query']['results']['channel']['atmosphere']['visibility']
          );
        
        console.log(conditionImage);
        
        $("#loading-container").hide()
        }     
    });
  });
});