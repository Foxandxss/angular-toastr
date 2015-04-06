(function() {
  'use strict';

  angular.module('toastr')
    .directive('progressBar', progressBar);

  function progressBar() {
    return {
      replace: true,
      require: '^toast',
      templateUrl: 'directives/progressbar/progressbar.html',
      link: linkFunction
    };

    function linkFunction(scope, element, attrs, toastCtrl) {
      var intervalId, currentTimeOut, hideTime;

      toastCtrl.progressBar = scope;

      scope.start = function(duration) {
        if (intervalId) {
          clearInterval(intervalId);
        }

        currentTimeOut = parseFloat(duration);
        hideTime = new Date().getTime() + currentTimeOut;
        intervalId = setInterval(updateProgress, 10);
      };

      scope.stop = function() {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };

      function updateProgress() {
        console.log('update');
        var percentage = ((hideTime - (new Date().getTime())) / currentTimeOut) * 100;
        element.css('width', percentage + '%');
      }

      scope.$on('$destroy', function() {
        // Failsafe stop
        clearInterval(intervalId);
      });
    }
  }
}());
