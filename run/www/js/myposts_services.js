angular.module('postService', ['ngResource'])

  .factory('postServ',['$resource','ip','$http','$q','$ionicLoading','$state',
    function($resource,ip,$http,$q,$ionicLoading,$state){
   return{
     //获得某用户发布的全部内容
     getMyPosts:function(page){
       var defer = $q.defer();
       $http({
         method:'get',
         url:ip+'getinfo.php?act=getUserActivity',
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
     },
     //获取我的评论
     getMyRemarks : function(page){
       var defer = $q.defer();
       $http({
         method:'get',
         url:ip+'getinfo.php?act=getRemark',
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
     },
     deleteMyPost : function(id){
       $ionicLoading.show({template: '正在删除...'})
       var defer = $q.defer();
       $http({
         method:'get',
         url:ip+'activity.php',
         params:{
           'a_id':id
         }
       }).success(function(data,status,headers,config){
         location.reload();
         defer.resolve(data);
       }).error(function(data,status,headers,config){
         alert('网络错误');
         defer.reject(data)
       });
       return defer.promise;
     },
     deleteMyRemarks : function(id){
       $ionicLoading.show({template: '正在删除...'})
         var defer = $q.defer();
         $http({
           method:'get',
           url:ip+'remark.php',
           params:{
             'r_id':id
           }
         }).success(function(data,status,headers,config){
           location.reload();
           defer.resolve(data);
         }).error(function(data,status,headers,config){
           alert('网络错误');
           defer.reject(data)
         });
         return defer.promise;
     }
   }

  }]);



