angular.module('myPostInfoCtrls', [])

//我的发布列表
  .controller('myPostsCtrl',['$scope', 'postServ','$state','$http',function($scope,postServ,$state,$http) {

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
      console.log(page);
      $http({
        method:'get',
        url:'http://120.27.107.121/getinfo.php?act=getUserActivity',
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


    //获取详情
    $scope.goToDetail = function(id) {
      $state.go('app.runInfo',{'infoId':id})
    }

  }])

 /* .controller('myPostDetailCtrl',['$scope','$stateParams',function($scope,$stateParams) {
//获得我的发布中某一帖子

  }])
*/
