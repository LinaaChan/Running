angular.module('starter.homeCtrl', ['ngResource'])

.controller('HomeCtrl',['$scope','homeDataServ','$resource','locals','$rootScope','$state','signServ','$ionicPopup','$http',
    function($scope,homeDataServ,$resource,locals,$rootScope,$state, signServ,$ionicPopup,$http){
   /*   $rootScope.$on('$locationChangeSuccess',function(){//返回前页时，刷新前页
        console.log('loactionchanged');
        parent.location.reload();
      });*/
      $scope.hasmore=true;
      var page = 1;
     $scope.listInfo=[];
    homeDataServ.getIndex(1).then(function(data){
      $scope.listInfo =  data.array;
    });
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

  //跳转到发布动态前，判断用户是否登录
    $scope.upload = function(){
      $rootScope.$on("NewStatus", function (event, update_status) {
        $scope.isLogged = update_status;
      });
      if(locals.get('username','')!=''|| $scope.isLogged){
        $state.go('app.runInfo_filling');
      }else{
        $scope.showPopup();
      }
    }


   $scope.loginData ={};
    var myPopup;
    $scope.showPopup = function () {
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
              }else{
                signServ.singn($scope.loginData.username, $scope.loginData.password);
              }
            }
          }
        ]
      });
    };

      $scope.goRegister = function () {
        myPopup.close();
        $state.go('app.register');
      }


     //获取详情
      $scope.goToDetail = function(id){
     /*   $rootScope.$on("NewStatus", function (event, update_status) {
          $scope.isLogged = update_status;
        });*/
        //if(locals.get('username','')!=''|| $scope.isLogged){
          $state.go('app.runInfo',{'infoId':id});
      /*  }else{
          $scope.showPopup();
        }*/

      };

       //天气插件
      (function(T,h,i,n,k,P,a,g,e){g=function(){P=h.createElement(i);a=h.getElementsByTagName(i)[0];P.src=k;P.charset="utf-8";P.async=1;a.parentNode.insertBefore(P,a)};T["ThinkPageWeatherWidgetObject"]=n;T[n]||(T[n]=function(){(T[n].q=T[n].q||[]).push(arguments)});T[n].l=+new Date();if(T.attachEvent){T.attachEvent("onload",g)}else{T.addEventListener("load",g,false)}}(window,document,"script","tpwidget","//widget.thinkpage.cn/widget/chameleon.js"))
      tpwidget("init", {
        "flavor": "bubble",
        "location": "WTW3SJ5ZBJUY",
        "geolocation": "disabled",
        "position": "bottom-right",
        "margin": "50px 30px",
        "language": "zh-chs",
        "unit": "c",
        "theme": "chameleon",
        "uid": "U9BAE1BB4E",
        "hash": "b09cdbe6156d086fa3fe32583cadaa6e"
      });
      tpwidget("show");
  }])
 ;
