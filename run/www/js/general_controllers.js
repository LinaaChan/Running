angular.module('starter.generalController', ['ngResource'])
  .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'getWeather', 'locals', '$state',
    'signServ', '$ionicPopup', '$rootScope','userInfoDataServ',
    function ($scope, $ionicModal, $timeout, getWeather, locals, $state, signServ, $ionicPopup, $rootScope,userInfoDataServ) {
//初始化当前登录状态

    $scope.isLogged = false;
    userInfoDataServ.getUserInfo().then(function(data){
      $scope.ava_default = data.photo;
      console.log($scope.ava_default);
        if(data.photo==null||data.photo==''){
          $scope.ava_default = 'img/a1.jpg';
        }
    });
//获取当前缓存
      $scope.MyName = locals.get('username', '');

//监听用户名的变化
      $rootScope.$on("NewData", function (event, update_name) {
        $scope.MyName = update_name;
      });
//如果用户头像上传成功，更新menu
      $rootScope.$on("NewAva", function (event, update_name) {
        $scope.ava_default = update_name;
      });
      $rootScope.$on("NewStatus", function (event, update_status) {
           $scope.isLogged = update_status;
    });

if(!$scope.isLogged){
  $scope.ava_default = 'img/a1.jpg';
  console.log($scope.ava_default);
}else{
  $scope.ava_default ='';
}

      /*首页天气显示*/
      var weather = getWeather.getWeatherInfo().then(function (data) {
        $scope.weather = data.results[0].now;
        $scope.weather_imgUrl = 'img/3d_60/'+data.results[0].now.code+'.png';
    }, function (err) {
      });


      //获取用户信息，跳转前判断是否已登录
      var myPopup;
      $scope.getInfo = function () {
        var username = locals.get('username', '');
        if (username == null || username == '' || username == 'undefined') {
          $scope.showPopup();
        } else {
          $state.go('app.userInfo',{userID:username});
        }
      }


      //登录函数
      $scope.loginData ={};
     $scope.showPopup = function () {
        myPopup = $ionicPopup.show({
          templateUrl: 'templates/loginPage.html',
          title: '登录',
          scope: $scope,
          buttons: [
            {text: '取消'},
            // {text: '注册'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function (e) {
                if($scope.loginData.username==''||$scope.loginData.password==''){
                  alert('用户名/密码不能为空');
                }else{
                  signServ.singn($scope.loginData.username, $scope.loginData.password);
                }
              }
            }
          ]
        });
      };

    //注销
      $scope.doExit = function () {
       var name_curr =   locals.get('username','');
       if(name_curr!=''){
         locals.set('username','');
         locals.set('password','');
         $rootScope.$broadcast("NewData", '');
         $rootScope.$broadcast("NewAva", 'img/a1.jpg');
         $rootScope.$broadcast("NewStatus", false);
         alert('注销成功');
       }else{
         alert('你还未登录哦！');
       }
      }
      $scope.goRegister = function () {
        myPopup.close();
        $state.go('app.register');
      }



    }])

  //注册页面控制器
  .controller('registerCtrl', ['$scope', 'registerServ', '$state', 'locals', '$resource', '$rootScope','$http','$q',
    function ($scope, registerServ, $state, locals, $resource, $rootScope,$http,$q) {
      $scope.signup = {};
      $scope.submitted = false;
      $scope.signupForm = function(form) {
        if (form.$valid) {
          console.log(form.$valid);
          $http.post(registerServ.resUrl,{account: $scope.signup.name, password: $scope.signup.password})
           .success( function (data) {
           locals.set('username',  $scope.signup.name);
           locals.set('password', $scope.signup.password);
           $rootScope.$broadcast("NewData",  $scope.signup.name);
           $rootScope.$broadcast("NewStatus",true);
          alert('注册成功！');
           $state.go('app.home');
           }).error( function (err) {
           alert('注册失败');
           $state.go('app.home')
           })
          // Submit as normal
        } else {
          console.log(form.submitted);
          form.submitted = true;
        }
      }

    }])
