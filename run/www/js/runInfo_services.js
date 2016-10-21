angular.module('runInfoService', ['ngResource'])

  .factory('runInfoDataServ',['$resource','ip','$http','$q','locals','$state','$window','$ionicLoading','$timeout','$ionicPopup',
    function($resource,ip,$http,$q,locals,$state,$window,$ionicLoading,$timeout,$ionicPopup){

    return{
      //发布动态的路由
      postRunInfoUrl:ip + 'activity.php?act=postActivity',
      postAction : function(runInfo){
        $ionicLoading.show({
          template: '正在上传',
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 200,
          showDelay: 0
        });
        $http.post(ip + 'activity.php?act=postActivity',{
          postTime : runInfo.date,
          address : runInfo.addr,
          p_number : runInfo.num,
          route :runInfo.route,
          distance : runInfo.len,
          description : runInfo.note,
          toAccount : locals.get('username',''),
          runtime : runInfo.timeLast,
          time : runInfo.timeCurr
        }).success(function(data){
          $state.go('app.home');
          $timeout(function(){
            $ionicLoading.hide();
          },1000);
        }).error(function(data){
          alert('系统错误');
        });

      },
      runInfoDetail : function(id){
        var defer = $q.defer();
        $http.get( ip +'getinfo.php?act=getActivity',{params:{'a_id':id}})
          .success(function(data){
          defer.resolve(data);
        }).error(function(data){
          defer.resolve(data);
        });
        return defer.promise;
      },
      //获得某一详情的评论
      getRemarks : function(id,page){
        var defer = $q.defer();
        $http.get( ip +'getinfo.php?act=getActivityRemark',{params:{'a_id':id,'page':page}})
          .success(function(data){
            defer.resolve(data);
          }).error(function(data){
            defer.resolve(data);
          });
        return defer.promise;
      },
      postRemarks : function(id,content){
        var defer = $q.defer();
        $ionicLoading.show({
          template: '正在上传',
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 200,
          showDelay: 0
      });
        $http.post(ip + 'remark.php?act=remark&a_id='+id,{
          content : content
        }).success(function(data){
          defer.resolve(data);
           //location.reload();
          $timeout(function(){
            $ionicLoading.hide();
          },1000);
        }).error(function(data){
          defer.resolve(data);
          $ionicPopup.alert({
            title: '提示',
            template: '系统错误'
          });
        });
        return defer.promise;
      }

    }

  }])

  .factory('userInfoDataServ',['$resource','ip','$http','$q','locals','$state','$cordovaFileTransfer','$rootScope','$ionicLoading','$timeout',
    function($resource,ip,$http,$q,locals,$state,$cordovaFileTransfer,$rootScope,$ionicLoading,$timeout){
      return {
        //上传头像
        uploadAva  : function(imgUrl) {
          var defer = $q.defer();
          $ionicLoading.show({
            template: '正在上传',
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
          });
          var myDate = new Date().toLocaleString();
          var imgName=locals.get('username','')+myDate;
          var url = ip+'photoUpload.php';
           var options = new FileUploadOptions();
           options.fileKey = "file";
           options.fileName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
           options.mimeType="image/jpeg";
            $cordovaFileTransfer.upload(url, imgUrl, options)
              .then(function (result) {
                $timeout(function(){
                  $ionicLoading.hide();
                },1500);
                defer.resolve(result);
              //  location.reload();
                  $rootScope.$broadcast('NewAva',imgUrl);
                  //$state.go("app.home", {}, { reload: true });
               //success
              }, function (err) {
                defer.resolve(err);
              //fail
              }, function (progress) {
                defer.resolve(progress);
                // constant progress updates
              });
          return defer.promise;
        },
        getUserInfo:function(){
          var defer = $q.defer();
          $http({
            method:'get',
            url: ip +'getinfo.php?act=getUserInfo',
            params:{
              'account':locals.get('username','')
            }
          }).success(function(data,status,headers,config){
            defer.resolve(data);
          }).error(function(data,status,headers,config){
            defer.reject(data);
            alert('系统错误!');
          });
          return defer.promise;
        },
        updateUserInfo : function(newUserInfo){
          var defer = $q.defer();
          $ionicLoading.show({
            template: '正在上传',
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
          });
          $http.post(ip + 'updateinfo.php?act=update',{
            name : newUserInfo.name,
            tel : newUserInfo.tel,
            age : newUserInfo.age,
            introduce : newUserInfo.introduce,
            school : '上海海事大学'
          }).success(function(data){
            defer.resolve(data);
            $timeout(function(){
              $ionicLoading.hide();
            },1500);
         //  location.reload();
          }).error(function(data){
            defer.resolve(data);
            alert('系统错误');
          });
          return defer.promise;
        },
        changePassword : function(pwd){
          var defer = $q.defer();
          $ionicLoading.show({
            template: '正在修改',
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
          });
          $http.post(ip + 'modifyPwd.php?act=modifyPwd',{
            oldPassword : locals.get('password',''),
            newPassword : pwd
          }).success(function(data){
            if(data==1){
              locals.set('password',pwd);
            }else{
              alert('修改失败');
            }
            defer.resolve(data);
            $timeout(function(){
              $ionicLoading.hide();
            },1500);
            //  location.reload();
          }).error(function(data){
            defer.resolve(data);
            alert('系统错误');
          });
          return defer.promise;
        }
        }

    }])



