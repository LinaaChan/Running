angular.module('starter.runCtrl', [])

//发布详细信息
  .controller('runInfoFillCtrl',['$scope','locals','runInfoDataServ', function($scope,locals,runInfoDataServ) {
    $scope.username =locals.get('username','');
    $scope.userpass =locals.get('password','');
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
      markers.push([e.lnglat.getLng(),e.lnglat.getLat()]);
      $scope.$broadcast("Marks",markers);
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
    $scope.upload = function(){
      console.log($scope.runInfoData);
      runInfoDataServ.postAction($scope.runInfoData);
    }




  }])

  .controller('runInfoCtrl',['$scope','locals','runInfoDataServ','$stateParams','$ionicModal',
    function($scope,locals,runInfoDataServ,$stateParams,$ionicModal) {
    //获取详情
    console.log($stateParams.infoId);
     runInfoDataServ.runInfoDetail($stateParams.infoId).then(function(data){
        $scope.details = data;
     });
    //获取当天动态的相关评论
    runInfoDataServ.getRemarks($stateParams.infoId).then(function(data){
      console.log(data);
      $scope.remarks = data.array;
    });


    //弹出填写评论的框
      $scope.edit = function(){
        $scope.openModal();
      }
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
        console.log($scope.comm_text);
        $scope.comm_text = text;
        if (text.length > 140) {
          $scope.comm_text = text.substr(0, 5);
        }
      };
      //发表评论
      $scope.sendRemark = function() {
        runInfoDataServ.postRemarks($stateParams.infoId,$scope.comm_text);
        $scope.modal.hide();
      };
    }])

  //用户详细信息
  .controller('userInfoCtrl',['$scope','locals','$ionicActionSheet','$cordovaCamera','userInfoDataServ','$cordovaImagePicker','$rootScope',
    function($scope,locals,$ionicActionSheet,$cordovaCamera,userInfoDataServ, $cordovaImagePicker,$rootScope) {

      userInfoDataServ.getUserInfo().then(function(data){
        console.log(data);
        $scope.myInfo=data;
        if(data.photo==null||data.photo==''){
          $scope.myInfo.photo = 'img/a1.jpg';
        }
      });

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
            quality: 20,                                            //相片质量0-100
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
            $scope.myInfo.photo = results[0];
            //userInfoDataServ.uploadAva(results[0]);
          }, function (error) {
          });
      }


      $scope.submitInfo = function(){
        $scope.edit();
        console.log($scope.myInfo);
        //上传信息
        userInfoDataServ.updateUserInfo($scope.myInfo);
        userInfoDataServ.uploadAva($scope.myInfo.photo);
      }


  }])

