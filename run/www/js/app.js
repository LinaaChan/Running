// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','starter.services', 'starter.homeCtrl', 'starter.runCtrl',
  'starter.generalController', 'starter.weaCtrl','logService','homeService','runInfoService','Directives','myPostInfoCtrls','postService'])

  .run(function ($ionicPlatform,$cordovaToast,$rootScope, $location, $timeout, $ionicHistory,$ionicPopup,$http,$interval,locals) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
     // $cordovaPlugin.someFunction().then(success, error);
      navigator.splashscreen.hide();
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      //启动极光推送服务
    //  window.plugins.jPushPlugin.init();
      //调试模式
     // window.plugins.jPushPlugin.setDebugMode(true);
  /*    window.plugins.jPushPlugin.openNotificationInAndroidCallback = function (data)
      {
        alert(data);
      };*/
    });

    $ionicPlatform.registerBackButtonAction(function (e) {
      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出应用?</strong>',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
        });
        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {
            // Don't close
          }
        });
      }
      //判断处于哪个页面时双击退出
      if ($location.path() == '/app/home' ) {
        showConfirm();
      } else if ($ionicHistory.backView() ) {
        $ionicHistory.goBack();
      } else {
        // This is the last page: Show confirmation popup
        showConfirm();
      }
      e.preventDefault();
      return false;
    }, 101);

    //每16分钟发送用户信息检测是否有更新
   /* $interval(function(){
     console.log('updating every 10s');
      if(locals.get('username','')!=null||locals.get('username','')!=undefined||locals.get('username','')!=''){
        console.log(locals.get('username',''));
         $http({
         method:'get',
         url:'http://120.27.107.121/test.php',
         params:{
         'account':locals.get('username','')
         }
         }).success(function(data,status,headers,config){
           console.log(data.array);
           $rootScope.$broadcast("JoinData", data.array);
         }).error(function(data,status,headers,config){
         console.log(data);
         });
        $rootScope.$on("JoinData", function (event, update_name) {
           alert('有参与的活动已被取消，请到我的参与查看')
        });
      }
    }, 10000);
*/

  })
  .config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";

  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');           //修改安卓的默认设置

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,//不完全显示页面
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })
      .state('app.userInfo', {
        url: '/userInfo',
        cache:'false',
        views: {
          'menuContent': {
            templateUrl: 'templates/userInfo.html',
            controller: 'userInfoCtrl'
          }
        }
      })

      .state('app.weather', {
        url: '/weather',
        views: {
          'menuContent': {
            templateUrl: 'templates/weather.html',
            controller: 'weatherCtrl'
          }
        }
      })
      //推送页面
      .state('app.message', {
        url: '/message',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/message.html',
            controller: 'messageCtrl'
          }
        }
      })
    .state('app.myJoin', {
        url: '/myJoin',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/myJoin.html',
            controller: 'myJoinCtrl'
          }
        }
      })

      .state('app.myPosts', {
        url: '/myPosts',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/myPosts.html',
            controller:'myPostsCtrl'
          }
        }
      })

      .state('app.myRemarks', {
        url: '/myRemarks',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/myRemarks.html',
            controller:'myRemarksCtrl'

          }
        }
      })


      .state('app.register', {
        url: '/register',
        views: {
          'menuContent': {
            templateUrl: 'templates/register.html',
            controller:'registerCtrl'

          }
        }
      })


      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })
      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.runInfo', {
        url: '/run/:infoId',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/runInfo.html',
            controller: 'runInfoCtrl'
          }
        }
      })
      .state('app.runInfo_filling', {
        url: '/runInfoPost',
        views: {
          'menuContent': {
            templateUrl: 'templates/runPost_filling.html',
            controller: 'runInfoFillCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
  });
