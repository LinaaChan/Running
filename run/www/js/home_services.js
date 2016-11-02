angular.module('homeService', ['ngResource'])


  //首页动态列表
  .factory('homeDataServ',['$resource','ip','$http','$q',function($resource,ip,$http,$q){
    var indexUrl = ip + 'index.php';
    return {
    //  getAllInfoUrl :  ip + 'getinfo.php?act=getUserActivity',
      getIndex : function(page){
        var defer = $q.defer();
        $http({
          method:'get',
          url:indexUrl,
          params:{
            'page':page
          }
        }).success(function(data,status,headers,config){
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          alert('网络错误');
          defer.reject(data)
        });
        return defer.promise;

      }
     // getUserInfo : ip+'getinfo.php?act=getUserActivity'
    }
  }])
  //我的参与
.factory('myJoinServ',['$resource','ip','$http','$q',function($resource,ip,$http,$q){

    return {
      getMyJoin : function(page){
        var defer = $q.defer();
        $http({
          method:'get',
          url:ip+'joined.php?act=myJoin',
          params:{
            'page':page
          }
        }).success(function(data,status,headers,config){
          console.log(data);
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          alert('网络错误');
          defer.reject(data)
        });
        return defer.promise;

      },
      joinActivity:function(id){
        console.log(id);
        var defer = $q.defer();
        $http({
          method:'get',
          url:ip+'JoinandCancel.php?act=join',
          params:{
            'a_id':id
          }
        }).success(function(data,status,headers,config){
          console.log(data);
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          alert('网络错误');
          defer.reject(data)
        });
        return defer.promise;
      },
      //取消活动
     cancelMyJoin:function(id){
       console.log(id);
         var defer = $q.defer();
         $http({
           method:'get',
           url:ip+'JoinandCancel.php?act=cancel',
           params:{
             'a_id':id
           }
         }).success(function(data,status,headers,config){
           console.log(data);
           defer.resolve(data);
         }).error(function(data,status,headers,config){
           alert('网络错误');
           defer.reject(data)
         });
         return defer.promise;
      },
      //判断用户是否已参加
      isJoined : function(id){
        console.log(id);
        var defer = $q.defer();
        $http({
          method:'get',
          url:ip+'joined.php?act=ifJoin',
          params:{
            'a_id':id
          }
        }).success(function(data,status,headers,config){
          console.log(data);
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          alert('网络错误');
          defer.reject(data)
        });
        return defer.promise;
      }
    }
  }])

  //我的消息
.factory('myMsgServ',['$resource','ip','$http','$q',function($resource,ip,$http,$q){

    return {
      getmyMsg : function(page){
        var defer = $q.defer();
        $http({
          method:'get',
          url:indexUrl,
          params:{
            'page':page
          }
        }).success(function(data,status,headers,config){
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          alert('网络错误');
          defer.reject(data)
        });
        return defer.promise;

      }
    }
  }]);



