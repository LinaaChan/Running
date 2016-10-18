angular.module('starter.services', ['ngResource'])

  /*项目云服务器接口*/
  .constant('ip', 'http://120.27.107.121/')

  /*获取天气情况的接口*/
  .factory('getWeather', ['$resource','$http','$q',function ($resource,$http,$q){

    return {
      getWeatherInfo : function(){
        var defer = $q.defer();
        $http({
          method:'get',
          url:'https://api.thinkpage.cn/v3/weather/now.json',
        //  headers: {'apikey':'94231514708a7948b90b085ab0959ae2'} , //请求头里会添加Authorization属性为'code_bunny'
          params : {
          'key':'ima3tmgnz2pl2vy8',
            'location':'ip',
            'language':'zh-Hans'
          }
        }).success(function(data,status,headers,config){
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          defer.reject(data)
        });
        return defer.promise;
      },
      getWeatherDays :function(){
        var defer = $q.defer();
        $http({
          method:'get',
          url:'https://api.thinkpage.cn/v3/weather/daily.json',
          params : {
            'key':'ima3tmgnz2pl2vy8',
            'location':'ip',
            'language':'zh-Hans',
            'start':0,
            'days':7
          }
        }).success(function(data,status,headers,config){
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          defer.reject(data)
        });
        return defer.promise;
      }
    }
  }])

  /*登录服务接口*/
  .factory('signServ', ['$resource', 'ip', 'locals','$state','$http','$rootScope','userInfoDataServ','$ionicPopup','$location',
    function ($resource, ip,locals,$state,$http,$rootScope,userInfoDataServ,$ionicPopup,$location) {
    //登录接口
    var sign = $resource(ip + 'register.php?act=login');
    return{
      //登录函数（参数：用户名，密码）
      singn : function(username,password,url){
        $http.post(ip + 'register.php?act=login',{account:username,password:password})
          .success(function(data){
            if(data==1){
               $rootScope.$broadcast("NewData", username);
              locals.set('username', username);
              locals.set('password', password);
              $rootScope.$broadcast("NewStatus",true);
              //alert('登录成功！');
              $ionicPopup.alert({
                title: '提示',
                template: '登录成功'
              });
              userInfoDataServ.getUserInfo().then(function(data){
                var ava_photo =  data.photo;
                if(data.photo==null||data.photo==''){
                  ava_photo = 'img/a1.jpg';
                }
                $rootScope.$broadcast("NewAva",ava_photo);
              });
              $location.path(url);
            }else{
             // alert('账户或用户名错误！');
              $ionicPopup.alert({
                title: '提示',
                template: '账户或用户名错误！'
              });
            }
          }).error(function(){
           // alert('系统错误');
            $ionicPopup.alert({
              title: '提示',
              template: '系统错误！'
            });
            $state.go('app.home');
          });

      }
    }

  }])

  /*注册服务接口*/
  .factory('registerServ', ['$resource', 'ip', '$http','$state','$q',function ($resource, ip,$http,$state,$q) {
   //注册接口
    return {
      resUrl :  ip + 'register.php?act=register',
      checkUserUrl : function(uname){
         var defer = $q.defer();
        $http.get( ip +'search.php',{params:{'account':uname}}).success(function(data){
          defer.resolve(data);
        }).error(function(data){
          defer.resolve(data);
        });
        return defer.promise;
      }
    };

  }])

//登录拦截模块
.factory('signBlock',['$state','locals','ip','$location','$http','$q',
    function($state,locals,ip,$location,$http,$q){
    return{
      //检验当前用户是否登录（是否合法），若没有，则跳转到登录页面，若已登录，则继续动作（对用户透明）
      blockTest : function(){
        var username = locals.get('username','');
        var password = locals.get('password','');
        var defer = $q.defer();
        $http.post(ip + 'register.php?act=login',{account:username,password:password})
          .success(function(data){
            defer.resolve(data);
          }).error(function(data){
            defer.resolve(data);
          });
        return defer.promise;
      }
    }

  }])




