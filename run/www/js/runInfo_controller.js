angular.module('starter.runCtrl', [])

//发布详细信息
  .controller('runInfoFillCtrl',['$scope','locals','runInfoDataServ', 'signBlock','$ionicPopup',
    function($scope,locals,runInfoDataServ,signBlock,$ionicPopup) {

    $scope.runInfoData = {};
    var myDate = new Date();
    //map
    var map = new AMap.Map('container',{
      zoom: 15,
      center: [121.904839,30.875321],
      zooms:[7,25],
      mapStyle:'blue_night'
    });
    var markers = [];//点标记
    var editor={};
    //获取当前点标记的位置方法marker.getPosition( )
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    var clickEventListener = map.on('click', function(e) {
      if(markers.length<5){
        markers.push([e.lnglat.getLng(),e.lnglat.getLat()]);
        $scope.$broadcast("Marks",markers);
      }else{
        $ionicPopup.confirm({
          title: '提醒',
          template: '最多只能选择五个点！'
        });
      }
    });
    $scope.$on('Marks', function (event, update_status) {
      map.clearMap();
      updateView(update_status);
    });
    var updateView = function(newMarks){
      for (var i = 0; i < newMarks.length; i++) {
        var marker = new AMap.Marker({
          map: map,
          animation: 'AMAP_ANIMATION_DROP',
          position: newMarks[i],
          raiseOnDrag: true,
          clickable: true
        });
        marker.content = '点击可删除';
        marker.index =i;
        marker.isFirstClicked = true;
        marker.on('click', markerClick);
        marker.emit('click', {target: marker});
      }
      new AMap.Polyline({
        map: map,
        path:  newMarks,
        strokeColor: "#FF33FF",//线颜色
        strokeOpacity: 1,//线透明度
        strokeWeight: 3,//线宽
        strokeStyle: "solid"//线样式
      });

    }

    function markerClick(e) {

      if(e.target.isFirstClicked){
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
        e.target.isFirstClicked = false;
      }else{
        e.target.setMap(null);
        markers.splice(e.target.index,1);
        $scope.$broadcast("Marks",markers);
      }

    }
    map.setFitView();
    $scope.runInfoData.timeCurr = myDate.toLocaleString();
    $scope.submitted = false;
    $scope.uploadForm = function(form) {
        if (form.$valid) {
          if(markers.length==0||markers.length==1){
            $ionicPopup.confirm({
              title: '提醒',
              template: '请描绘路线(至少两个点，最多五个点)'
            });
          }else{
            $scope.runInfoData.route  = markers.toString();
            runInfoDataServ.postAction($scope.runInfoData);
          }
        } else {
          form.submitted = true;
        }
      }
  }])

  //某个动态的详细信息
  .controller('runInfoCtrl',['$scope','locals','runInfoDataServ','$stateParams','$ionicModal','signBlock','$state','$ionicPopup','signServ','$location','$ionicLoading','$http','myJoinServ',
    function($scope,locals,runInfoDataServ,$stateParams,$ionicModal,signBlock,$state,$ionicPopup,signServ,$location,$ionicLoading,$http,myJoinServ) {
    //获取详情

      //获取（某用户是否参与某活动,传参：$stateParams.infoId）
      var isJoined = function(){
        myJoinServ.isJoined($stateParams.infoId).then(function(data){
          if(data==1){
            $scope.isJoined = true;
          }else{
            $scope.isJoined = false;
          }

        })
      }
      isJoined();

      var markers=[];
      var map = new AMap.Map('container',{
        zoom: 15,
        center: [121.904839,30.875321],
        zooms:[7,25],
        mapStyle:'blue_night'
      });

     runInfoDataServ.runInfoDetail($stateParams.infoId).then(function(data){
       var polygonArr =[];
       $scope.details = data;
       markers = data.route.split(",");

       //获取路线地图
        for(var i=0;i<markers.length;i+=2){
        polygonArr.push([markers[i],markers[i+1]]);
        new AMap.Marker({
        map: map,
        animation: 'AMAP_ANIMATION_DROP',
        position: [markers[i],markers[i+1]],
        raiseOnDrag: false,
        clickable: false
        });
        }
       new AMap.Polyline({
         map: map,
         path:  polygonArr,
         strokeColor: "#FF33FF",//线颜色
         strokeOpacity: 1,//线透明度
         strokeWeight: 3,//线宽
         strokeStyle: "solid"//线样式
       });
     });



    //获取动态的相关评论（有分页设置）
      $scope.hasmore=true;
      var page = 1;
      $scope.remarks=[];
    runInfoDataServ.getRemarks($stateParams.infoId,1).then(function(data){
      $scope.hasRemark = false;
      if(data!=null||data!=''){
        $scope.remarks = data.array;
        $scope.hasRemark = true;
      }
    });

      //刷新当前动态的评论
      $scope.doRefresh = function(){
         page = 1;
        $scope.remarks=[];
        runInfoDataServ.getRemarks($stateParams.infoId,1).then(function(data){
          $scope.hasRemark = false;
          if(data!=null||data!=''){
            $scope.remarks = data.array;
            $scope.hasRemark = true;
          }
        }).then(function(){
          $scope.$broadcast('scroll.refreshComplete');
        });
      }
      //上拉加载更多
      $scope.loadMore = function() {
        page = page+1;
        $http({
          method:'get',
          url:'http://120.27.107.121/getinfo.php?act=getActivityRemark',
          params:{
            'page':page,
            'a_id':$stateParams.infoId
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

      //登录模块
      $scope.loginData ={};
      var myPopup;
      $scope.showPopup = function (url) {
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
                }else{signServ.singn($scope.loginData.username, $scope.loginData.password,url);
                }
              }
            }
          ]
        });
      };
      //跳到注册模块
      $scope.goRegister = function () {
        myPopup.close();
        $state.go('app.register');
      }

      //弹出填写评论的框(登录拦截)
      $scope.edit = function(){
        signBlock.blockTest().then(function(data){
          if(data==1){
            $scope.openModal();
          }else{
            $scope.showPopup($location.path);
          }
        })
      }

      //报名(登录拦截)
      $scope.addMyJoin = function(){
        signBlock.blockTest().then(function(data){
          if(data==1){
           myJoinServ.joinActivity($stateParams.infoId).then(function(){
             isJoined();
           });
          }else{
            $scope.showPopup($location.path);
          }
        })
      }

       //取消(登录拦截)
      $scope.cancelMyJoin = function(){
        signBlock.blockTest().then(function(data){
          if(data==1){
           myJoinServ.cancelMyJoin($stateParams.infoId).then(function(){
             isJoined();
           });
          }else{
            $scope.showPopup($location.path);
          }
        })
      }

//评论框
      $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // 当隐藏的模型时执行动作
    $scope.$on('modal.hide', function() {
      // 执行动作
    });
    // 当移动模型时执行动作
    $scope.$on('modal.removed', function() {
      // 执行动作
    });
    //字数限制
      $scope.textChange = function(text){
        $scope.textLength = text.length;
        $scope.comm_text = text;
        if (text.length > 140) {
          $scope.comm_text = text.substr(0, 5);
        }
      };
      //发表评论
      $scope.sendRemark = function() {
        if($scope.comm_text==''||$scope.comm_text==undefined){
          alert('评论不能为空');
        }else{
          runInfoDataServ.postRemarks($stateParams.infoId,$scope.comm_text).then(function(){
            $scope.doRefresh();
          });
          $scope.modal.hide();
        }
      };
    }])

  //用户详细信息
  .controller('userInfoCtrl',['$scope','locals','$ionicActionSheet','$cordovaCamera','userInfoDataServ','$cordovaImagePicker','$rootScope','$ionicPopup','signBlock','$location','signServ','$state','$ionicModal','$timeout',
    function($scope,locals,$ionicActionSheet,$cordovaCamera,userInfoDataServ, $cordovaImagePicker,$rootScope,$ionicPopup,signBlock,$location,signServ,$state,$ionicModal,$timeout) {
      $scope.doRefresh = function(){
        userInfoDataServ.getUserInfo().then(function(data){
          $scope.myInfo=data;
          if(data.photo==null||data.photo==''){
            $scope.myInfo.photo = 'img/a1.jpg';
          }
        });
      }
      $scope.doRefresh();

     /* $rootScope.$on("NewAva", function (event, update_name) {
        $scope.myInfo.photo = update_name;
      });*/
    $scope.username =locals.get('username','');
    $scope.password =locals.get('password','');

    $scope.isEdit = false;
    $scope.edit = function(){
      $scope.isEdit =!$scope.isEdit;
    }



    $scope.addAttachment = function () {
      $ionicActionSheet.show({
        buttons: [
          {text: '<p class="actionsheet">相机</p>'},
          {text: '<p class="actionsheet">图库</p>'}
        ],
        cancelText: '关闭',
        cancel: function () {
          return true;
        },
        buttonClicked: function (index) {
          switch (index) {
            case 0:
              takePhoto();
              break;   //选择调用相机功能
            case 1:
              pickImage();
              break;   //选择调用相册功能
            default:
              break;
          }
          return true;
        }
      })
    };

  //调用相机
        var takePhoto = function () {
          var options = {
            //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
            quality: 50,                                            //相片质量0-100
            destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
            sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
            allowEdit: false,                                        //在选择之前允许修改截图
            encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
            targetWidth: 200,                                        //照片宽度
            targetHeight: 200,                                       //照片高度
            mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
            cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true                                   //保存进手机相册
          };

          $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.myInfo.photo = imageData;
            $scope.showConfirm(imageData);
          }, function (err) {
          });

        }

//调用相册
      var pickImage = function () {
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 50
        };

        $cordovaImagePicker.getPictures(options)
          .then(function (results) {
            $scope.showConfirm(results[0]);
            $scope.myInfo.photo = results[0];
            //跳出确认框，选择是否上传图片
          }, function (error) {
          });
      }

      $scope.showConfirm = function(imgUrl) {
        var confirmPopup = $ionicPopup.confirm({
          title: '确认上传',
          templateUrl: 'uploadImgTemp.html'
        });
        confirmPopup.then(function(res) {
          if(res) {
            userInfoDataServ.uploadAva(imgUrl).then(function(){
              $scope.doRefresh();
            });
          } else {
            console.log('You are not sure');
          }
        });
      };

//更新我的信息（登录拦截）
      $scope.submitInfo = function(){
        //登录判断
        signBlock.blockTest().then(function(data){
          if(data==1){
            $scope.edit();
            userInfoDataServ.updateUserInfo($scope.myInfo).then(function(){
              $scope.doRefresh();
            });
          }else{
            $scope.showPopup($location.path());
          }
        })
      }
//修改密码（登录拦截）
      $scope.newPwd = {};
//先确认密码
      $scope.showConfirmPop = function(){
        $scope.confirmPwd = {}
        var confirmPwdPop = $ionicPopup.show({
          template: '<input type="password" ng-model="confirmPwd.password">',
          title: '请输入当前密码',
          scope: $scope,
          buttons: [
            { text: '取消' },
            {
              text: '<b>确认</b>',
              type: 'button-positive',
              onTap: function(e) {
                if($scope.confirmPwd.password==locals.get('password','')){
                  confirmPwdPop .close();
                  $scope.openModal1();
                }else{
                  alert('密码错误！');
                }
              }
            }
          ]
        });
      }

      $scope.changePassword = function(){
        if($scope.newPwd.password1==$scope.newPwd.password2){
          userInfoDataServ.changePassword($scope.newPwd.password1).then(function(){
            $scope.doRefresh();
            $scope.closeModal1();
          });
        }else{
          alert('两次输入的密码不同!');
        }
      }

      //修改密码框
      $ionicModal.fromTemplateUrl('my-password.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal1 = modal;
      });
      $scope.openModal1 = function() {
        $scope.modal1.show();
      };
      $scope.closeModal1 = function() {
        $scope.modal1.hide();
      };
      //当我们用到模型时，清除它！
      $scope.$on('$destroy', function() {
        $scope.modal1.remove();
      });

      //登录模块
      $scope.loginData ={};
      var myPopup;
      $scope.showPopup = function (url) {
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
                }else{signServ.singn($scope.loginData.username, $scope.loginData.password,url);
                }
              }
            }
          ]
        });
      };
      //跳到注册模块
      $scope.goRegister = function () {
        myPopup.close();
        $state.go('app.register');
      }

      //弹出填写我的简介的框(登录拦截)
      $scope.showModel = function(){
        signBlock.blockTest().then(function(data){
          if(data==1){
            $scope.openModal();
          }else{
            $scope.showPopup($location.path);
          }
        })
      }

//评论框
      $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //当我们用到模型时，清除它！
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // 当隐藏的模型时执行动作
      $scope.$on('modal.hide', function() {
        // 执行动作
      });
      // 当移动模型时执行动作
      $scope.$on('modal.removed', function() {
        // 执行动作
      });
      //字数限制
      $scope.textChange = function(text){
        $scope.textLength = text.length;
        $scope.myInfo.introduce = text;
        if (text.length > 140) {
          $scope.myInfo.introduce = text.substr(0, 5);
        }
      };
      //发表评论
      $scope.sendIntro = function() {
        userInfoDataServ.updateUserInfo($scope.myInfo);
        $scope.modal.hide();
      };

  }])

