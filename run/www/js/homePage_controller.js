angular.module('starter.homeCtrl', ['ngResource'])

.controller('HomeCtrl',['$scope','homeDataServ','$resource','locals','$rootScope','$state','signServ','$ionicPopup','$http','signBlock','$location',
    function($scope,homeDataServ,$resource,locals,$rootScope,$state, signServ,$ionicPopup,$http,signBlock,$location){

     $scope.hasmore=true;
      var page = 1;
     $scope.listInfo=[];
    homeDataServ.getIndex(1).then(function(data){
      $scope.listInfo =  data.array;
    });
      //刷新
      $scope.doRefresh = function() {
        page=1;
        $scope.hasmore=true;
        homeDataServ.getIndex(1).then(function(data){
          $scope.listInfo =  data.array;

        }).then(function(){
          $scope.$broadcast('scroll.refreshComplete');
        });


      };

    //上拉加载更多
      $scope.loadMore = function() {
        page = page+1;
        console.log(page);
        $http({
          method:'get',
          url:'http://120.27.107.121/index.php',
          params:{
            'page':page
          }
        }).success(function(data) {
          console.log(data.array);
          if (data.array==null||data.array.length==0 ||data.array==undefined) {
            console.log("结束");
            $scope.hasmore=false;
          }else{
            for(var j=0;j<data.array.length;j++)
              $scope.listInfo.push(data.array[j]);
            if(data.array.length<10&&data.array.length>0){
              console.log("结束");
              $scope.hasmore=false;
            }else{
              $scope.hasmore=true;
            }
            console.log($scope.listInfo);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.$on('stateChangeSuccess', function() {
        $scope.loadMore();
      });



  //跳转到发布动态
    $scope.upload = function(){
      signBlock.blockTest('app.runInfo_filling').then(function(data){
        if(data==1){
          $state.go('app.runInfo_filling');
        }else{
          $scope.showPopup($location.path());
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

     //获取详情(不需要登录)
      $scope.goToDetail = function(id){
          $state.go('app.runInfo',{'infoId':id});
      };

  }])
 ;
