angular.module('runInfoService', ['ngResource'])

  .factory('runInfoDataServ',['$resource','ip','$http','$q','locals','$state','$window',
    function($resource,ip,$http,$q,locals,$state,$window){

    return{
      //发布动态的路由
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
          alert('发布成功！');
          $state.go('app.home');
          //$window.location.href = 'index.html#/app/home'
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
      getRemarks : function(id){
        var defer = $q.defer();
        $http.get( ip +'getinfo.php?act=getActivityRemark',{params:{'a_id':id}})
          .success(function(data){
            console.log(data);
            defer.resolve(data);
          }).error(function(data){
            defer.resolve(data);
          });
        return defer.promise;
      },
      postRemarks : function(id,content){
        //remarkid为动态id
        $http.post(ip + 'remark.php?act=remark&a_id='+id,{
          content : content
        }).success(function(data){
          console.log(data);
          alert('发布成功！');
          $window.location.href = '/app/home'
        }).error(function(data){
          alert('系统错误');
        });
      }

    }

  }])

  .factory('userInfoDataServ',['$resource','ip','$http','$q','locals','$state','$cordovaFileTransfer',
    function($resource,ip,$http,$q,locals,$state,$cordovaFileTransfer){
      return {
        uploadAva  : function(imgUrl) {
          //图片上传upImage（图片路径）
          //http://ngcordova.com/docs/plugins/fileTransfer/  资料地址
          var myDate = new Date().toLocaleString();
          var imgName=locals.get('username','')+myDate;
          alert('默认路径名:'+imgName);
          var url = ip+'photoUpload.php';
           var options = new FileUploadOptions();
           options.fileKey = "file";
           options.fileName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
           options.mimeType="image/jpeg";

            $cordovaFileTransfer.upload(url, imgUrl, options)
              .then(function (result) {
                alert(result);
               //success
              }, function (err) {
              //fail
              }, function (progress) {
                // constant progress updates
              });
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

          $http.post(ip + 'updateinfo.php?act=update',{
            name : newUserInfo.name,
            tel : newUserInfo.tel,
            age : newUserInfo.age,
            introduce : newUserInfo.introduce,
            school : '上海海事大学'
          }).success(function(data){
            $state.go('app.home');
          }).error(function(data){
            alert('系统错误');
          });

        }
        }

    }])



