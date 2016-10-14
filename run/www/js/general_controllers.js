angular.module('starter.generalController', ['ngResource'])
  .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'getWeather', 'locals', '$state',
    'signServ',  '$rootScope','userInfoDataServ','signBlock','$ionicPopup','$location',
    function ($scope, $ionicModal, $timeout, getWeather, locals, $state, signServ, $rootScope,userInfoDataServ,signBlock,$ionicPopup,$location) {
//初始化当前登录状态

    $scope.isLogged = false;
    userInfoDataServ.getUserInfo().then(function(data){
      $scope.ava_default = data.photo;
      console.log($scope.ava_default);
        if(data.photo==null||data.photo==''||data.photo==undefined){
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


      //获取用户信息
      $scope.getInfo = function () {
        signBlock.blockTest().then(function(data){
          if(data==1){
            $state.go('app.userInfo');
          }else{
            $scope.showPopup('app/userInfo');
          }
        })
      }
      //获取用户发布过的动态
      $scope.getPosts= function () {
        signBlock.blockTest().then(function(data){
          if(data==1){
            $state.go('app.myPosts');
          }else{
            $scope.showPopup('app/myPosts');
          }
        })
      }
 //获取用户发布过的评论
      $scope.getRemark = function () {
        signBlock.blockTest().then(function(data){
          if(data==1){
            $state.go('app.myRemarks');
          }else{
            $scope.showPopup('app/myRemarks');
          }
        })
      }

      //登录模块
      $scope.loginData ={};
      var myPopup;
      $scope.showPopup = function (url) {
        myPopup = $ionicPopup.show({
          templateUrl: 'templates/loginPage.html',
          title: '登录',
          scope: $scope,
          buttons: [
            {text: '取消'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function (e) {
                if($scope.loginData.username==''||$scope.loginData.password==''||$scope.loginData.username==undefined||$scope.loginData.password==undefined){
                  alert('用户名/密码不能为空');
                }else{signServ.singn($scope.loginData.username, $scope.loginData.password,url);
                }
              }
            }
          ]
        });
      };
      //跳到注册模块
      $scope.goRegister = function () {
        myPopup.close();
        $state.go('app.register');
      }

    //注销
      $scope.doExit = function () {
       var name_curr =   locals.get('username','');
       if(name_curr!=''){
         locals.set('username','');
         locals.set('password','');
         $rootScope.$broadcast("NewData", '');
         $rootScope.$broadcast("NewAva", 'img/a1.jpg');
         $rootScope.$broadcast("NewStatus", false);
         $ionicPopup.alert({
           title: '提示',
           template: '注销成功'
         });
       }else{
         $ionicPopup.alert({
           title: '提示',
           template: '你还未登录哦！'
         });
       }
      }
      $scope.goRegister = function () {
        myPopup.close();
        $state.go('app.register');
      }
    }])

  //注册页面控制器
  .controller('registerCtrl', ['$scope', 'registerServ', '$state', 'locals', '$resource', '$rootScope','$http','$ionicPopup',
    function ($scope, registerServ, $state, locals, $resource, $rootScope,$http,$ionicPopup) {
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
              $ionicPopup.alert({
                title: '提示',
                template: '欢迎成为我们的一员！'
              });
           $state.go('app.home');
           }).error( function (err) {
              $ionicPopup.alert({
                title: '提示',
                template: '注册失败'
              });
           $state.go('app.home')
           })
        } else {
          console.log(form.submitted);
          form.submitted = true;
        }
      }

    }])


