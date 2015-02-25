(function() {
  'use strict';

  angular.module('toastr')
    .directive('toast', toast);

  toast.$inject = ['$injector', '$interval', 'toastr'];

  function toast($injector, $interval, toastr) {
    return {
      replace: true,
      templateUrl: 'templates/toastr/toastr.html',
      link: toastLinkFunction
    };

    function toastLinkFunction(scope, element, attrs) {
      var timeout;

      scope.toastClass = scope.options.toastClass;
      scope.titleClass = scope.options.titleClass;
      scope.messageClass = scope.options.messageClass;

      if (wantsCloseButton()) {
        var button = angular.element(scope.options.closeHtml),
          $compile = $injector.get('$compile');
        button.addClass('toast-close-button');
        button.attr('ng-click', 'close()');
        $compile(button)(scope);
        element.prepend(button);
      }

      scope.init = function() {
        if (scope.options.timeOut) {
          timeout = createTimeout(scope.options.timeOut);
        }
        if (scope.options.onShown) {
          scope.options.onShown();
        }
      };

      element.on('mouseenter', function() {
        if (timeout) {
          $interval.cancel(timeout);
        }
      });

      scope.tapToast = function () {
        if (scope.options.tapToDismiss) {
          scope.close(true);
        }
      };

      scope.close = function (wasClicked) {
        toastr.remove(scope.toastId, wasClicked);
      };

      element.on('mouseleave', function() {
        if (scope.options.timeOut === 0 && scope.options.extendedTimeOut === 0) { return; }
        timeout = createTimeout(scope.options.extendedTimeOut);
      });

      function createTimeout(time) {
        return $interval(function() {
          toastr.remove(scope.toastId);
        }, time, 1);
      }

      function wantsCloseButton() {
        return scope.options.closeHtml;
      }
    }
  }
}());
