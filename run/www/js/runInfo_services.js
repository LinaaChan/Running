angular.module('runInfoService', ['ngResource'])

  .factory('runInfoDataServ',['$resource','ip','$http','$q','locals','$state',
    function($resource,ip,$http,$q,locals,$state){

    return{
  postRunInfoUrl:ip + 'activity.php?act=postActivity',
      postAction : function(runInfo){
        console.log(runInfo);
        $http.post(ip + 'activity.php?act=postActivity',{
          postTime : runInfo.date,
          address : runInfo.addr,
          p_number : runInfo.num,
          route : '',
          distance : runInfo.len,
          description : runInfo.note,
          toAccount : locals.get('username',''),
          runtime : runInfo.timeLast,
          time : runInfo.timeCurr
        }).success(function(data){
          console.log(data);
          alert('发布成功！');
          $state.go('app.home');
        }).error(function(data){
          alert('系统错误');
        })
      },
      runInfoDetail : function(id){
        console.log(id);
        var defer = $q.defer();
        $http.get( ip +'getinfo.php?act=getActivity',{params:{'a_id':id}})
          .success(function(data){
            console.log(data);
          defer.resolve(data);
        }).error(function(data){
          defer.resolve(data);
        });
        return defer.promise;
      }
}

  }])
  .factory('userInfoDataServ',['$resource','ip','$http','$q','locals','$state','$cordovaFileTransfer',
    function($resource,ip,$http,$q,locals,$state,$cordovaFileTransfer){

      return {
        uploadAva  : function(imgUrl) {
          //图片上传upImage（图片路径）
          //http://ngcordova.com/docs/plugins/fileTransfer/  资料地址
          var upImage = function (imageUrl) {
            var url = "http://192.168.1.248/api/UserInfo/PostUserHead";
            var options = {};
            $cordovaFileTransfer.upload(url, imageUrl, options)
              .then(function (result) {
                alert(JSON.stringify(result.response));
                alert("success");
                alert(result.message);
              }, function (err) {
                alert(JSON.stringify(err));
                alert(err.message);
                alert("fail");
              }, function (progress) {
                // constant progress updates
              });


          }

        }
      }

    }])




