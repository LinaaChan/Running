angular.module('homeService', ['ngResource'])

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
          console.log(data);
          defer.resolve(data);
        }).error(function(data,status,headers,config){
          defer.reject(data)
        });
        return defer.promise;

      }
     // getUserInfo : ip+'getinfo.php?act=getUserActivity'
    }



  }]);



