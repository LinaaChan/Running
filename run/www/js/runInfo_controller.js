angular.module('starter.runCtrl', [])

//发布详细信息
  .controller('runInfoFillCtrl',['$scope','locals','runInfoDataServ', function($scope,locals,runInfoDataServ) {
    $scope.username =locals.get('username','');
    $scope.userpass =locals.get('password','');
    $scope.runInfoData = {};
    var myDate = new Date();
    $scope.runInfoData.timeCurr = myDate.toLocaleString();
    $scope.upload = function(){
      runInfoDataServ.postAction($scope.runInfoData);
    }
  }])

  .controller('runInfoCtrl',['$scope','locals','runInfoDataServ','$stateParams',function($scope,locals,runInfoDataServ,$stateParams) {
     runInfoDataServ.runInfoDetail($stateParams.infoId).then(function(data){
       console.log(data);
     });
  }])

  //用户详细信息
  .controller('userInfoCtrl',['$scope','updateInfoServ','locals','$ionicActionSheet','$cordovaCamera','userInfoDataServ','$cordovaImagePicker',
    function($scope,updateInfoServ,locals,$ionicActionSheet,$cordovaCamera,userInfoDataServ, $cordovaImagePicker) {

    $scope.username =locals.get('username','');
    $scope.newInfo ={};
    $scope.submitInfo = function(){
      updateInfoServ.updateUserInfo(username,tel,age,intro,school);
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
            quality: 100,                                            //相片质量0-100
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
            alert(imageData);
           // CommonJs.AlertPopup(imageData);
           // var image = document.getElementById('myImage');
           // image.src = imageData;
           // upImage(imageData);
            //image.src = "data:image/jpeg;base64," + imageData;
          }, function (err) {
            // error
           // CommonJs.AlertPopup(err.message);
          });

        }

//调用相册
      var pickImage = function () {
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 80
        };

        $cordovaImagePicker.getPictures(options)
          .then(function (results) {
            alert(results[0]);
           // $scope.images_list.push(results[0]);
          //  upImage(results[0]);
          }, function (error) {
            // error getting photos
          });
      }




  }])

