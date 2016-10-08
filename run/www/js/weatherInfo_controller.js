angular.module('starter.weaCtrl', [])


  .controller('weatherCtrl',['$scope', 'getWeather', function ($scope, getWeather) {
    var weather = getWeather. getWeatherDays().then(function (data) {

      var date = new Date().getHours();

      console.log(data);
      console.log(data.results[0].daily);
      $scope.weatherDays = data.results[0].daily;
     // console.log(data.daily[0]);

    }, function (err) {

    });
   /* var weatherAir = getWeather.getWeatherAir().then(function(data){
      console.log(data);

    },function(err){

    })*/

  }])
;
