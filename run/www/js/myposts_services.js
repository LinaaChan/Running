angular.module('postService', ['ngResource'])

  .factory('postServ',['$resource','ip','$http','$q',function($resource,ip,$http,$q){
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
     getMyRemark : function(){

     }
   }

  }]);



