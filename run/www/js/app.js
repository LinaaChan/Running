// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','starter.services', 'starter.homeCtrl', 'starter.runCtrl',
  'starter.generalController', 'starter.weaCtrl','logService','homeService','runInfoService','Directives','myPostInfoCtrls'])

  .run(function ($ionicPlatform,$cordovaToast,$rootScope, $location, $timeout, $ionicHistory,$ionicPopup,$templateCache ) {
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

  })
  .config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
//	delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
        abstract: true,
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

      .state('app.myPosts', {
        url: '/myPosts',
        views: {
          'menuContent': {
            templateUrl: 'templates/myPosts.html',
            controller:'myPostsCtrl'

          }
        }
      })

  /*    .state('app.myPostsDetail', {
        url: '/myPost_detail',
        views: {
          'menuContent': {
            templateUrl: 'templates/myPost_detail.html',
            controller: 'myPostDetailCtrl'
          }
        }
      })*/
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
            controller: 'HomeCtrl',
            cache:'false'
          }
        }
      })

    /*  .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      })*/
      .state('app.runInfo', {
        url: '/run/:infoId',
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
