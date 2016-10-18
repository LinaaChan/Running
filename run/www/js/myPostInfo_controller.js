angular.module('myPostInfoCtrls', [])

//我的发布列表
  .controller('myPostsCtrl',['$scope', 'postServ','$state','$http','$ionicLoading',function($scope,postServ,$state,$http,$ionicLoading) {

    //应有一个登录拦截
    $scope.hasmore=true;
    var page = 1;
    $scope.listInfo=[];
    postServ.getMyPosts(1).then(function(data){
      $scope.listInfo =  data.array;
    });
    $scope.doRefresh = function() {
      page=1;
      $scope.hasmore=true;
      postServ.getMyPosts(1).then(function(data){
        $scope.listInfo =  data.array;

      }).then(function(){
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    //上拉加载更多
    $scope.loadMore = function() {
      page = page+1;
      $http({
        method:'get',
        url:'http://120.27.107.121/getinfo.php?act=getUserActivity',
        params:{
          'page':page
        }
      }).success(function(data) {
        if (data.array==null||data.array.length==0 ||data.array==undefined) {
          $scope.hasmore=false;
        }else{
          for(var j=0;j<data.array.length;j++)
            $scope.listInfo.push(data.array[j]);
          if(data.array.length<10&&data.array.length>0){
            $scope.hasmore=false;
          }else{
            $scope.hasmore=true;
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.$on('stateChangeSuccess', function() {
      $scope.loadMore();
    });

    //删除我的动态
    $scope.remove = function(id){
       postServ.deleteMyPost(id).then(function(){
         $scope.doRefresh();
       });
    }
    //获取详情
    $scope.goToDetail = function(id) {
      $state.go('app.runInfo',{'infoId':id})
    }

  }])

  //获取我的评论
  .controller('myRemarksCtrl',['$scope','postServ','$state','$http',
    function($scope,postServ,$state,$http) {
//获得我的发布中某一帖子

    $scope.hasmore=true;
    var page = 1;
    $scope.listInfo=[];
    postServ.getMyRemarks(1).then(function(data){
      $scope.listInfo =  data.array;
    })
    $scope.doRefresh = function() {
      page=1;
      $scope.hasmore=true;
      postServ.getMyRemarks(1).then(function(data){
        $scope.listInfo =  data.array;
      }).then(function(){
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    //上拉加载更多
    $scope.loadMore = function() {
      page = page+1;
      $http({
        method:'get',
        url:'http://120.27.107.121/getinfo.php?act=getRemark',
        params:{
          'page':page
        }
      }).success(function(data) {
        if (data.array==null||data.array.length==0 ||data.array==undefined) {
          $scope.hasmore=false;
        }else{
          for(var j=0;j<data.array.length;j++)
            $scope.listInfo.push(data.array[j]);
          if(data.array.length<10&&data.array.length>0){
            $scope.hasmore=false;
          }else{
            $scope.hasmore=true;
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.$on('stateChangeSuccess', function() {
      $scope.loadMore();
    });

    //删除我的评论
    $scope.remove = function(id){
      postServ.deleteMyRemarks(id).then(function(){
        $scope.doRefresh();
      });
    }
    //获取详情
    $scope.goToDetail = function(id) {
      $state.go('app.runInfo',{'infoId':id})
    }

  }])
