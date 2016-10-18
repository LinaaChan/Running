angular.module('Directives', ['ngCordova'])
  .directive('ensureUnique', ['$http','$timeout','$window','ip',function($http,$timeout,$window,ip) {
    return {
      restrict:"A",
      require: 'ngModel',
      link: function(scope, ele, attrs, ngModelController) {
        scope.$watch(attrs.ngModel, function(n) {
          if (!n) return;
          $timeout.cancel($window.timer);
          $window.timer = $timeout(function(){
            $http({
              method: 'get',
              url: ip +'search.php',
              params:{
                "account":n
              }
            }).success(function(data) {
              if(data==1){
                ngModelController.$setValidity('unique', true);
              }else{
                ngModelController.$setValidity('unique', false);
              }
            //  ngModelController.$setValidity('unique', data);
            }).error(function(data) {
              ngModelController.$setValidity('unique', false);
            });
          },500);
        });
      }
    };
  }])
  .directive('ngFocus', [function() {
    var FOCUS_CLASS = "ng-focused";
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        ctrl.$focused = false;
        element.bind('focus', function(evt) {
          element.addClass(FOCUS_CLASS);
          scope.$apply(function() {ctrl.$focused = true;});
        }).bind('blur', function(evt) {
          element.removeClass(FOCUS_CLASS);
          scope.$apply(function() {ctrl.$focused = false;});
        });
      }
    }
  }])

  .controller('signupController', ['$scope', function($scope) {
    $scope.submitted = false;
    $scope.signupForm = function() {
      if ($scope.signup_form.$valid) {
        // Submit as normal
      } else {
        $scope.signup_form.submitted = true;
      }
    }
  }])

  .directive('loginCheck', [function() {
    return {
      restrict: 'A',
      controller:function($scope,$ionicModal){
        $ionicModal.fromTemplateUrl('loginPage.html', {
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
      }
    }
  }])



