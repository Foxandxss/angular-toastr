angular.module('app', ['toastr'])

  .config(function(toastrConfig) {
    toastrConfig.positionClass = 'toast-bottom-right';
  })

  .controller('MainCtrl', function($scope, $timeout, toastr) {
    toastr.success('I am fox', 'Hello');
    $timeout(function() { // Simulate delay
      toastr.error('I am another toastr'); // No title
    }, 1000);
    $timeout(function() { // Simulate delay
      toastr.warning('Warning warning, intruder alert, intruder alert', 'Warning');
    }, 2000);
    $timeout(function() { // Simulate delay
      toastr.info('We are closed today', 'Notice');
    }, 3000);
  });