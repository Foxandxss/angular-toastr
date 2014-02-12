angular.module('app', ['toastr'])
  .controller('MainCtrl', function($scope, toastr) {
    toastr.success();
  });